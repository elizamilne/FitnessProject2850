package org.fitnessapp.data

import org.fitnessapp.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

object ExerciseMetricTypeSeeder {

    fun seed() = transaction {

        val inputStream = object {}.javaClass
            .getResourceAsStream("/data/exercise_metric_types.csv")
            ?: error("Cannot find exercise_metric_types.csv")

        val exerciseMap = Exercise
            .selectAll()
            .associateBy { row ->
                val name = row[Exercise.name]
                    ?: error("Exercise.name is null in DB")

                name.trim().lowercase()
            }

        val metricMap = MetricType
            .selectAll()
            .associateBy { row ->
                val name = row[MetricType.name]
                    ?: error("MetricType.name is null in DB")

                name.trim().lowercase()
            }

        inputStream.bufferedReader().useLines { lines ->
            lines.drop(1).forEach { line ->

                val parts = line.split(",", limit = 2)

                if (parts.size == 2) {
                    val exerciseName = parts[0].trim().lowercase()
                    val metricName = parts[1].trim().lowercase()

                      val exercise = exerciseMap[exerciseName]
                        if (exercise == null) {
                            println("⚠️ Skipping unknown exercise: '$exerciseName'")
                            return@forEach
                        }

                        val metric = metricMap[metricName]
                        if (metric == null) {
                            println("⚠️ Skipping unknown metric: '$metricName'")
                            return@forEach
                        }
                        
                    ExerciseMetricTypes.insertIgnore {
                        it[exerciseId] = exercise[Exercise.id]
                        it[metricTypeId] = metric[MetricType.id]
                    }
                }
            }
        }
    }
}