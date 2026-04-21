package org.fitnessapp.data

import org.fitnessapp.models.Exercise
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll

object ExerciseSeeder {

    fun seed() {
        val inputStream = object {}.javaClass
            .getResourceAsStream("/data/exercises.csv")
            ?: error("Cannot find exercises.csv")

        inputStream.bufferedReader().useLines { lines ->
            lines.drop(1).forEach { line ->
                val parts = line.split(",", limit = 2)

                if (parts.size == 2) {
                    val name = parts[0].trim()
                    val image = parts[1].trim()

                    val exists = Exercise
                        .selectAll()
                        .where { Exercise.name eq name }
                        .singleOrNull()

                    if (exists == null) {
                        Exercise.insert {
                            it[Exercise.name] = name
                            it[Exercise.image] = image
                        }
                    }
                }
            }
        }
    }
}