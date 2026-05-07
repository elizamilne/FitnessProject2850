package org.fitnessapp.services

import org.fitnessapp.models.Activity
import org.fitnessapp.models.ActivityMetric
import org.fitnessapp.models.Exercise
import org.fitnessapp.models.MetricType
import org.fitnessapp.models.ProgramExercise
import org.fitnessapp.models.UpdateActivityMetricRequest
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate

class ActivityMetricServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:activity_metric_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;NON_KEYWORDS=UNIT",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(
                ActivityMetric,
                Activity,
                MetricType,
                ProgramExercise,
                Exercise
            )

            SchemaUtils.create(
                Exercise,
                ProgramExercise,
                MetricType,
                Activity,
                ActivityMetric
            )

            exec("SET REFERENTIAL_INTEGRITY FALSE")
        }
    }

    private fun createExercise(
        name: String = "Bench Press",
        image: String = "bench.png"
    ): Long {
        return transaction {
            Exercise.insert {
                it[Exercise.name] = name
                it[Exercise.image] = image
            } get Exercise.id
        }
    }

    private fun createProgramExercise(
        exerciseId: Long = createExercise()
    ): Long {
        return transaction {
            ProgramExercise.insert {
                it[ProgramExercise.programId] = 1L
                it[ProgramExercise.exerciseId] = exerciseId
            } get ProgramExercise.id
        }
    }

    private fun createActivity(
        activityIdProfileId: Long = 1L,
        programExerciseId: Long = createProgramExercise(),
        date: LocalDate = LocalDate.parse("2026-01-01")
    ): Long {
        return transaction {
            Activity.insert {
                it[Activity.date] = date
                it[Activity.profileId] = activityIdProfileId
                it[Activity.programExerciseId] = programExerciseId
            } get Activity.id
        }
    }

    private fun createMetricType(
        name: String = "Weight",
        unit: String = "kg"
    ): Long {
        return transaction {
            MetricType.insert {
                it[MetricType.name] = name
                it[MetricType.unit] = unit
            } get MetricType.id
        }
    }

    private fun createActivityMetric(
        activityId: Long = createActivity(),
        metricTypeId: Long = createMetricType(),
        value: Double = 10.0
    ): Long {
        return transaction {
            ActivityMetric.insert {
                it[ActivityMetric.activityId] = activityId
                it[ActivityMetric.metricTypeId] = metricTypeId
                it[ActivityMetric.value] = BigDecimal.valueOf(value)
            } get ActivityMetric.id
        }
    }

    @Test
    fun `findActivityMetricsByActivityId returns metrics for activity`() {
        val activityId = createActivity()
        val weightMetricId = createMetricType("Weight", "kg")
        val repsMetricId = createMetricType("Reps", "reps")

        createActivityMetric(
            activityId = activityId,
            metricTypeId = weightMetricId,
            value = 80.0
        )

        createActivityMetric(
            activityId = activityId,
            metricTypeId = repsMetricId,
            value = 10.0
        )

        val metrics = ActivityMetricService.findActivityMetricsByActivityId(activityId)

        assertEquals(2, metrics.size)
        assertTrue(metrics.any { it.activityId == activityId && it.metricTypeId == weightMetricId && it.value == 80.0 })
        assertTrue(metrics.any { it.activityId == activityId && it.metricTypeId == repsMetricId && it.value == 10.0 })
    }

    @Test
    fun `findActivityMetricsByActivityId ignores metrics for other activities`() {
        val activityOneId = createActivity()
        val activityTwoId = createActivity()
        val metricTypeId = createMetricType("Weight", "kg")

        createActivityMetric(
            activityId = activityOneId,
            metricTypeId = metricTypeId,
            value = 80.0
        )

        createActivityMetric(
            activityId = activityTwoId,
            metricTypeId = metricTypeId,
            value = 100.0
        )

        val metrics = ActivityMetricService.findActivityMetricsByActivityId(activityOneId)

        assertEquals(1, metrics.size)
        assertEquals(activityOneId, metrics.first().activityId)
        assertEquals(80.0, metrics.first().value)
    }

    @Test
    fun `findActivityMetricsByActivityId returns empty list when activity has no metrics`() {
        val activityId = createActivity()

        val metrics = ActivityMetricService.findActivityMetricsByActivityId(activityId)

        assertTrue(metrics.isEmpty())
    }

    @Test
    fun `updateActivityMetricById updates metric value`() {
        val activityId = createActivity()
        val metricTypeId = createMetricType("Weight", "kg")

        val activityMetricId = createActivityMetric(
            activityId = activityId,
            metricTypeId = metricTypeId,
            value = 80.0
        )

        val updatedCount = ActivityMetricService.updateActivityMetricById(
            activityMetricId,
            UpdateActivityMetricRequest(
                value = 95.5
            )
        )

        val metrics = ActivityMetricService.findActivityMetricsByActivityId(activityId)

        assertEquals(1, updatedCount)
        assertEquals(1, metrics.size)
        assertEquals(95.5, metrics.first().value)
    }

    @Test
    fun `updateActivityMetricById returns zero when metric does not exist`() {
        val updatedCount = ActivityMetricService.updateActivityMetricById(
            999L,
            UpdateActivityMetricRequest(
                value = 50.0
            )
        )

        assertEquals(0, updatedCount)
    }

    @Test
    fun `toActivityMetricDTO converts row to dto`() {
        val activityId = createActivity()
        val metricTypeId = createMetricType("Time", "seconds")

        val activityMetricId = createActivityMetric(
            activityId = activityId,
            metricTypeId = metricTypeId,
            value = 60.0
        )

        val metric = ActivityMetricService
            .findActivityMetricsByActivityId(activityId)
            .first()

        assertEquals(activityMetricId, metric.id)
        assertEquals(activityId, metric.activityId)
        assertEquals(metricTypeId, metric.metricTypeId)
        assertEquals(60.0, metric.value)
    }
}