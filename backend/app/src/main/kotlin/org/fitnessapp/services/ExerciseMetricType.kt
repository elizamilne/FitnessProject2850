package org.fitnessapp.services

import org.fitnessapp.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.insertIgnore

object ExerciseMetricTypeService {

    fun createByName(exerciseName: String, metricTypeName: String) = transaction {

        val exId = Exercise
            .selectAll()
            .where { Exercise.name eq exerciseName }
            .singleOrNull()
            ?.get(Exercise.id)
            ?: error("Exercise not found: $exerciseName")

        val mtId = MetricType
            .selectAll()
            .where { MetricType.name eq metricTypeName }
            .singleOrNull()
            ?.get(MetricType.id)
            ?: error("MetricType not found: $metricTypeName")

        ExerciseMetricTypes.insertIgnore {
            it[exerciseId] = exId
            it[metricTypeId] = mtId
        }
    }

    fun getMetricsForExercise(exerciseId: Long): List<MetricTypeDTO> = transaction {
        (ExerciseMetricTypes innerJoin MetricType)
            .selectAll()
            .where { ExerciseMetricTypes.exerciseId eq exerciseId }
            .map {
                MetricTypeDTO(
                    id = it[MetricType.id],
                    name = it[MetricType.name],
                    unit = it[MetricType.unit]
                )
            }
    }
}