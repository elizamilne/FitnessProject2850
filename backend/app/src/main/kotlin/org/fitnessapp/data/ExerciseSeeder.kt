package org.fitnessapp.data.seed

import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.InputStreamReader

import org.fitnessapp.models.Exercise
import org.fitnessapp.models.ExerciseSeed

object ExerciseSeeder {

    fun seedExercisesFromCsv() {

        val inputStream = object {}.javaClass
            .getResourceAsStream("/data/exercises.csv")
            ?: return println("CSV file not found — skipping seeding.")

        InputStreamReader(inputStream).use { reader ->
            CSVParser(
                reader,
                CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .build()
            ).use { csvParser ->

                var inserted = 0
                var skipped = 0

                // Get existing exercise names to avoid duplicates
                val existingNames = transaction {
                    Exercise.selectAll().mapNotNull { it[Exercise.name] }.toSet()
                }

                transaction {
                    for (record in csvParser) {

                        val name = record.get("name")?.trim()
                        if (name.isNullOrBlank()) continue

                        if (name in existingNames) {
                            skipped++
                            continue
                        }

                        // ✅ Map CSV → ExerciseSeed
                        val exercise = ExerciseSeed(
                            name = name,
                            image = record.get("image")?.takeIf { it.isNotBlank() }
                        )

                        try {
                            // ✅ Insert using ExerciseSeed
                            Exercise.insert {
                                it[Exercise.name] = exercise.name
                                it[Exercise.image] = exercise.image
                            }

                            inserted++

                        } catch (e: Exception) {
                            println("Failed to insert '${exercise.name}': ${e.message}")
                        }
                    }
                }

                println(
                    "\n✔ Exercise Seeding Complete\n" +
                    "   Inserted: $inserted\n" +
                    "   Skipped:  $skipped\n"
                )
            }
        }
    }
}