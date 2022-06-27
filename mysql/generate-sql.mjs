#!/usr/bin/env zx

import { fetch } from "zx"

const firstNamesJsonPath = __dirname + "/first_names.json"
const lastNamesJsonPath = __dirname + "/last_names.json"
const sqlPath = __dirname + "/src/setup.sql"

/**
 * @template T
 * @param {T[]} choices
 * @return {T}
 */
const randomChoose = (choices) => choices[Math.floor(Math.random() * choices.length)]

/**
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
const randomInt = (min, max) => {
    if (min > max) {
        throw Error()
    }
    const minInt = Math.ceil(min)
    const maxInt = Math.floor(max)
    return Math.floor(Math.random() * (maxInt - minInt) + minInt)
}

/**
 * @param {Date} start
 * @param {Date} end
 * @return {Date}
 */
const randomDate = (start, end) => {
    if (start > end) {
        throw Error()
    }
    const cs = new Date(start.getTime())
    const ce = new Date(end.getTime())
    const diff = ce.getTime() - cs.getTime()
    const randomTime = new Date(cs.getTime() + randomInt(0, diff))
    return new Date(randomTime.getFullYear(), randomTime.getMonth(), randomTime.getDate())
}

/**
 * @param {Date} date
 * @param {string} format
 * @return {string}
 */
const formatDate = (date, format) =>
    format
        .replace(/Y/, date.getFullYear().toString())
        .replace(/m/, (date.getMonth() + 1).toString().padStart(2, "0"))
        .replace(/d/, date.getDate().toString().padStart(2, "0"))
        .replace(/H/, date.getHours().toString().padStart(2, "0"))
        .replace(/i/, date.getMinutes().toString().padStart(2, "0"))
        .replace(/s/, date.getSeconds().toString().padStart(2, "0"))

const loadNames = async () => {
    const [femaleFirstNamesResponse, maleFirstNamesResponse, lastNamesResponse] = await Promise.all([
        fetch("https://raw.githubusercontent.com/arineng/arincli/master/lib/female-first-names.txt"),
        fetch("https://raw.githubusercontent.com/arineng/arincli/master/lib/male-first-names.txt"),
        fetch("https://raw.githubusercontent.com/arineng/arincli/master/lib/last-names.txt"),
    ])

    const femaleFirstNamesText = await femaleFirstNamesResponse.text()
    const maleFirstNamesText = await maleFirstNamesResponse.text()
    const lastNamesText = await lastNamesResponse.text()
    const firstNames = [...femaleFirstNamesText.trim().split("\n"), ...maleFirstNamesText.trim().split("\n")].sort()
    const lastNames = lastNamesText.trim().split("\n").sort()

    await Promise.all([
        fs.writeJSON(firstNamesJsonPath, firstNames, { flag: "w" }),
        fs.writeJSON(lastNamesJsonPath, lastNames, { flag: "w" }),
    ])
}

const generateSQL = async () => {
    const [firstNameChoices, lastNameChoices] = await Promise.all([
        fs.readJSON(firstNamesJsonPath),
        fs.readJSON(lastNamesJsonPath),
    ])

    const tableName = "customer"
    const dropTableQuery = `DROP TABLE IF EXISTS ${tableName};`
    const createTableQuery = `CREATE TABLE ${tableName}
                                  (
                                      id bigint AUTO_INCREMENT NOT NULL,
                                      first_name varchar(255) NOT NULL,
                                      last_name varchar(255) NOT NULL,
                                      gender tinyint NOT NULL,
                                      birth_date date NOT NULL,
                                      created_at datetime NOT NULL,
                                      updated_at datetime NOT NULL,
                                      PRIMARY KEY (id)
                                  )
    DEFAULT CHARACTER SET utf8mb4
    COLLATE \`utf8mb4_bin\`
    ENGINE = InnoDB;`
    const insertQueries = Array.from(Array(10).keys()).map(() => {
        const records = Array.from(Array(100000).keys()).map(() => {
            return {
                firstName: randomChoose(firstNameChoices)
                    .toLocaleLowerCase()
                    .replace(/^./, (s) => s.toUpperCase()),
                lastName: randomChoose(lastNameChoices)
                    .toLocaleLowerCase()
                    .replace(/^./, (s) => s.toUpperCase()),
                gender: randomChoose([1, 2]),
                birthDate: formatDate(randomDate(new Date(1980, 1, 1), new Date(2022, 6, 14)), "Y-m-d"),
                createdAt: "2022-06-14 20:30:00",
                updatedAt: "2022-06-14 20:30:00",
            }
        })
        const valuesStmts = records
            .map(
                (r) =>
                    `('${r.firstName}','${r.lastName}',${r.gender},'${r.birthDate}','${r.createdAt}','${r.updatedAt}')`
            )
            .join(",")
        return `INSERT INTO ${tableName} (first_name, last_name, gender, birth_date, created_at, updated_at)
                VALUES ${valuesStmts};`
    })
    const queries = [dropTableQuery, createTableQuery, ...insertQueries]
        .map((q) => q.replaceAll(/\n/g, ""))
        .map((q) => q.replaceAll(/ +/g, " "))

    await fs.remove(sqlPath)
    for (const query of queries) {
        await fs.writeFile(sqlPath, query, { flag: "a" })
    }
}

const [firstNamesExists, lastNamesExists] = await Promise.all([
    fs.pathExists(firstNamesJsonPath),
    fs.pathExists(lastNamesJsonPath),
])
if (!firstNamesExists || !lastNamesExists) {
    await loadNames()
}
await generateSQL()
