package org.fitnessapp.services

import org.fitnessapp.models.CreateProgramExerciseMetricRequest
import org.fitnessapp.models.MetricType
import org.fitnessapp.models.ProgramExercise
import org.fitnessapp.models.ProgramExerciseMetric
import org.fitnessapp.models.UpdateProgramExerciseMetricRequest
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ProgramExerciseMetricServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:program_exercise_metric_test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(
                ProgramExerciseMetric,
                MetricType,
                ProgramExercise
            )

            SchemaUtils.create(
                ProgramExercise,
                MetricType,
                ProgramExerciseMetric
            )

            // Allows testing without creating Program / Exercise / MetricType parent rows first.
            exec("SET REFERENTIAL_INTEGRITY FALSE")
        }
    }

    private fun createMetric(
        metricTypeId: Long = 1L,
        programExerciseId: Long = 1L,
        value: Double = 10.0
    ): Long {
        return ProgramExerciseMetricService.createProgramExerciseMetricAndReturnId(
            CreateProgramExerciseMetricRequest(
                metricTypeId = metricTypeId,
                programExerciseId = programExerciseId,
                value = value
            )
        )
    }

    @Test
    fun `createProgramExerciseMetricAndReturnId creates metric and returns its id`() {
        val id = createMetric(
            metricTypeId = 1L,
            programExerciseId = 10L,
            value = 12.5
        )

        val metrics = ProgramExerciseMetricService.findMetricsByProgramExerciseId(10L)

        assertEquals(1, metrics.size)
        assertEquals(id, metrics.first().id)
        assertEquals(1L, metrics.first().metricTypeId)
        assertEquals(10L, metrics.first().programExerciseId)
        assertEquals(12.5, metrics.first().value)
    }

    @Test
    fun `findMetricsByProgramExerciseId returns all metrics for matching program exercise`() {
        createMetric(
            metricTypeId = 1L,
            programExerciseId = 100L,
            value = 80.0
        )

        createMetric(
            metricTypeId = 2L,
            programExerciseId = 100L,
            value = 10.0
        )

        createMetric(
            metricTypeId = 3L,
            programExerciseId = 200L,
            value = 999.0
        )

        val metrics = ProgramExerciseMetricService.findMetricsByProgramExerciseId(100L)

        assertEquals(2, metrics.size)
        assertTrue(metrics.any { it.metricTypeId == 1L && it.value == 80.0 })
        assertTrue(metrics.any { it.metricTypeId == 2L && it.value == 10.0 })
        assertTrue(metrics.none { it.programExerciseId == 200L })
    }

    @Test
    fun `findMetricsByProgramExerciseId returns empty list when no metrics exist`() {
        val metrics = ProgramExerciseMetricService.findMetricsByProgramExerciseId(999L)

        assertTrue(metrics.isEmpty())
    }

    @Test
    fun `updateProgramExerciseMetricById updates metric value`() {
        val id = createMetric(
            metricTypeId = 1L,
            programExerciseId = 10L,
            value = 20.0
        )

        val updatedCount = ProgramExerciseMetricService.updateProgramExerciseMetricById(
            id,
            UpdateProgramExerciseMetricRequest(
                value = 35.5
            )
        )

        val metrics = ProgramExerciseMetricService.findMetricsByProgramExerciseId(10L)

        assertEquals(1, updatedCount)
        assertEquals(1, metrics.size)
        assertEquals(35.5, metrics.first().value)
    }

    @Test
    fun `updateProgramExerciseMetricById returns zero when metric does not exist`() {
        val updatedCount = ProgramExerciseMetricService.updateProgramExerciseMetricById(
            999L,
            UpdateProgramExerciseMetricRequest(
                value = 50.0
            )
        )

        assertEquals(0, updatedCount)
    }

    @Test
    fun `CreateProgramExerciseMetricRequest toProgramExerciseMetricDTO converts request to dto`() {
        val request = CreateProgramExerciseMetricRequest(
            metricTypeId = 5L,
            programExerciseId = 9L,
            value = 15.0
        )

        val dto = request.toProgramExerciseMetricDTO(id = 123L)

        assertEquals(123L, dto.id)
        assertEquals(5L, dto.metricTypeId)
        assertEquals(9L, dto.programExerciseId)
        assertEquals(15.0, dto.value)
    }

    @Test
    fun `toProgramExerciseMetricDTO converts result row to dto`() {
        val id = createMetric(
            metricTypeId = 2L,
            programExerciseId = 10L,
            value = 42.0
        )

        val metric = ProgramExerciseMetricService
            .findMetricsByProgramExerciseId(10L)
            .first()

        assertEquals(id, metric.id)
        assertEquals(2L, metric.metricTypeId)
        assertEquals(10L, metric.programExerciseId)
        assertEquals(42.0, metric.value)
    }
}