package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.innerJoin
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.JoinType

import java.math.BigDecimal

import org.fitnessapp.models.ProgramExercise
import org.fitnessapp.models.ProgramExerciseDTO
import org.fitnessapp.models.ProgramExerciseWithMetricsDTO
import org.fitnessapp.models.CreateProgramExerciseRequest

import org.fitnessapp.models.ProgramExerciseMetric
import org.fitnessapp.models.ProgramExerciseMetricRequest
import org.fitnessapp.models.ProgramExerciseMetricResponseDTO

import org.fitnessapp.models.MetricType
import org.fitnessapp.models.MetricTypeDTO
import org.fitnessapp.models.Exercise

import org.fitnessapp.services.MetricTypeService

fun ResultRow.toProgramExerciseDTO() = ProgramExerciseDTO(
    id = this[ProgramExercise.id],
    programId = this[ProgramExercise.programId],
    exerciseId = this[ProgramExercise.exerciseId]
)

fun ResultRow.toProgramExerciseWithMetrics(): ProgramExerciseWithMetricsDTO {
    val peId = this[ProgramExercise.id]

    val metrics = ProgramExerciseService.getMetricsForProgramExercise(peId)

    return ProgramExerciseWithMetricsDTO(
        programExerciseId = peId,
        exerciseName = this[Exercise.name] ?: "",
        image = this[Exercise.image] ?: "",
        metrics = metrics
    )
}

object ProgramExerciseService {
    fun createProgramExercise(
        builder: InsertStatement<*>,
        request: CreateProgramExerciseRequest
    ) {
        builder[ProgramExercise.programId] = request.programId
        builder[ProgramExercise.exerciseId] = request.exerciseId
    }

    fun createProgramExerciseMetric(
        builder: InsertStatement<*>,
        programExerciseId: Long,
        metric: ProgramExerciseMetricRequest
    ) {
        builder[ProgramExerciseMetric.programExerciseId] = programExerciseId
        builder[ProgramExerciseMetric.metricTypeId] = metric.metricTypeId
        builder[ProgramExerciseMetric.value] = BigDecimal.valueOf(metric.value)
    }

    fun getMetricsForProgramExercise(
        programExerciseId: Long
    ): List<ProgramExerciseMetricResponseDTO> {
        return ProgramExerciseMetric
            .join(
                MetricType,
                JoinType.INNER,
                additionalConstraint = {
                    ProgramExerciseMetric.metricTypeId eq MetricType.id
                }
            )
            .selectAll()
            .where {
                ProgramExerciseMetric.programExerciseId eq programExerciseId
            }
            .map { row ->
                ProgramExerciseMetricResponseDTO(
                    metricType = MetricTypeDTO(
                        id = row[MetricType.id],
                        name = row[MetricType.name],
                        unit = row[MetricType.unit]
                    ),
                    value = row[ProgramExerciseMetric.value].toDouble()
                )
            }
    }
    
    fun getProgramExerciseIds(programId: Long): List<Long> {
        return ProgramExercise
            .selectAll().where { ProgramExercise.programId eq programId }
            .map { it[ProgramExercise.id] }
    }

    fun findAllProgramExercises(): List<ProgramExerciseDTO> = transaction {
        ProgramExercise
            .selectAll()
            .map { it.toProgramExerciseDTO() }
    }

    fun createProgramExerciseAndReturnId(
        request: CreateProgramExerciseRequest
    ): Long =
        ProgramExercise.insert { builder ->
            createProgramExercise(builder, request)
        } get ProgramExercise.id


    fun insertMetricIfTypeExists(
        programExerciseId: Long,
        metric: ProgramExerciseMetricRequest
    ) {
        if (MetricTypeService.metricTypeExists(metric.metricTypeId)) {
            ProgramExerciseMetric.insert { builder ->
                createProgramExerciseMetric(builder, programExerciseId, metric)
            }
        }
    }

    fun insertMetricsForProgramExercise(
        programExerciseId: Long,
        metrics: List<ProgramExerciseMetricRequest>
    ) {
        metrics.forEach { metric ->
            insertMetricIfTypeExists(programExerciseId, metric)
        }
    }

    fun deleteProgramExerciseAndMetrics(programExerciseId: Long): Int = transaction {
        ProgramExerciseMetric.deleteWhere {
            ProgramExerciseMetric.programExerciseId eq programExerciseId
        }

        ProgramExercise.deleteWhere {
            ProgramExercise.id eq programExerciseId
        }
    }
}