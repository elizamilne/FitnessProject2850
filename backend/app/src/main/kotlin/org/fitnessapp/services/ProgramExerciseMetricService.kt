package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.update
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

import java.math.BigDecimal

import org.fitnessapp.models.ProgramExerciseMetric
import org.fitnessapp.models.ProgramExerciseMetricDTO
import org.fitnessapp.models.CreateProgramExerciseMetricRequest
import org.fitnessapp.models.UpdateProgramExerciseMetricRequest

fun ResultRow.toProgramExerciseMetricDTO() = ProgramExerciseMetricDTO(
    id = this[ProgramExerciseMetric.id],
    metricTypeId = this[ProgramExerciseMetric.metricTypeId],
    programExerciseId = this[ProgramExerciseMetric.programExerciseId],
    value = this[ProgramExerciseMetric.value].toDouble()
)

fun CreateProgramExerciseMetricRequest.toProgramExerciseMetricDTO(
    id: Long
) = ProgramExerciseMetricDTO(
    id = id,
    metricTypeId = metricTypeId,
    programExerciseId = programExerciseId,
    value = value
)

object ProgramExerciseMetricService {
    fun createProgramExerciseMetric(
        builder: InsertStatement<*>,
        request: CreateProgramExerciseMetricRequest
    ) {
        builder[ProgramExerciseMetric.metricTypeId] = request.metricTypeId
        builder[ProgramExerciseMetric.programExerciseId] = request.programExerciseId
        builder[ProgramExerciseMetric.value] = request.value.toBigDecimal()
    }

    fun updateProgramExerciseMetric(
        builder: UpdateBuilder<*>,
        request: UpdateProgramExerciseMetricRequest
    ) {
        builder[ProgramExerciseMetric.metricTypeId] = request.metricTypeId
        builder[ProgramExerciseMetric.programExerciseId] = request.programExerciseId
        builder[ProgramExerciseMetric.value] = request.value.toBigDecimal()
    }

    fun findAllProgramExerciseMetrics(): List<ProgramExerciseMetricDTO> = transaction {
        ProgramExerciseMetric
            .selectAll()
            .map { it.toProgramExerciseMetricDTO() }
    }

    fun findProgramExerciseMetricById(id: Long): ProgramExerciseMetricDTO? = transaction {
        ProgramExerciseMetric
            .selectAll()
            .where { ProgramExerciseMetric.id eq id }
            .map { it.toProgramExerciseMetricDTO() }
            .singleOrNull()
    }

    fun createProgramExerciseMetricAndReturnId(
        request: CreateProgramExerciseMetricRequest
    ): Long = transaction {
        ProgramExerciseMetric.insert { builder ->
            createProgramExerciseMetric(builder, request)
        } get ProgramExerciseMetric.id
    }

    fun updateProgramExerciseMetricById(
        id: Long,
        request: UpdateProgramExerciseMetricRequest
    ): Int = transaction {
        ProgramExerciseMetric.update(
            { ProgramExerciseMetric.id eq id }
        ) { builder ->
            updateProgramExerciseMetric(builder, request)
        }
    }

    fun deleteProgramExerciseMetricById(id: Long): Int = transaction {
        ProgramExerciseMetric.deleteWhere {
            ProgramExerciseMetric.id eq id
        }
    }

    fun deleteProgramExerciseMetrics(ids: List<Long>) {
        if (ids.isEmpty()) return

        ids.forEach { id ->
            ProgramExerciseMetric.deleteWhere {
                ProgramExerciseMetric.programExerciseId eq id
            }
        }
    }
}