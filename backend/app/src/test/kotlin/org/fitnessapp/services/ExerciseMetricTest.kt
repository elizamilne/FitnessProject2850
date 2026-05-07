package org.fitnessapp.services

import org.fitnessapp.models.Exercise
import org.fitnessapp.models.ExerciseMetricTypes
import org.fitnessapp.models.MetricType
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ExerciseMetricTypeServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:exercise_metric_type_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;NON_KEYWORDS=UNIT",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(
                ExerciseMetricTypes,
                MetricType,
                Exercise
            )

            SchemaUtils.create(
                Exercise,
                MetricType,
                ExerciseMetricTypes
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

    @Test
    fun `createByName links exercise to metric type`() {
        val exerciseId = createExercise(
            name = "Bench Press",
            image = "bench.png"
        )

        val metricTypeId = createMetricType(
            name = "Weight",
            unit = "kg"
        )

        ExerciseMetricTypeService.createByName(
            exerciseName = "Bench Press",
            metricTypeName = "Weight"
        )

        val rows = transaction {
            ExerciseMetricTypes.selectAll().toList()
        }

        assertEquals(1, rows.size)
        assertEquals(exerciseId, rows.first()[ExerciseMetricTypes.exerciseId])
        assertEquals(metricTypeId, rows.first()[ExerciseMetricTypes.metricTypeId])
    }

    @Test
    fun `createByName does not duplicate existing exercise metric type link`() {
        createExercise(
            name = "Squat",
            image = "squat.png"
        )

        createMetricType(
            name = "Reps",
            unit = "reps"
        )

        ExerciseMetricTypeService.createByName(
            exerciseName = "Squat",
            metricTypeName = "Reps"
        )

        ExerciseMetricTypeService.createByName(
            exerciseName = "Squat",
            metricTypeName = "Reps"
        )

        val rows = transaction {
            ExerciseMetricTypes.selectAll().toList()
        }

        assertEquals(1, rows.size)
    }

    @Test
    fun `createByName throws when exercise does not exist`() {
        createMetricType(
            name = "Weight",
            unit = "kg"
        )

        val exception = assertThrows(IllegalStateException::class.java) {
            ExerciseMetricTypeService.createByName(
                exerciseName = "Missing Exercise",
                metricTypeName = "Weight"
            )
        }

        assertEquals("Exercise not found: Missing Exercise", exception.message)
    }

    @Test
    fun `createByName throws when metric type does not exist`() {
        createExercise(
            name = "Deadlift",
            image = "deadlift.png"
        )

        val exception = assertThrows(IllegalStateException::class.java) {
            ExerciseMetricTypeService.createByName(
                exerciseName = "Deadlift",
                metricTypeName = "Missing Metric"
            )
        }

        assertEquals("MetricType not found: Missing Metric", exception.message)
    }

    @Test
    fun `getMetricsForExercise returns linked metric types`() {
        val exerciseId = createExercise(
            name = "Bench Press",
            image = "bench.png"
        )

        createMetricType(
            name = "Weight",
            unit = "kg"
        )

        createMetricType(
            name = "Reps",
            unit = "reps"
        )

        ExerciseMetricTypeService.createByName(
            exerciseName = "Bench Press",
            metricTypeName = "Weight"
        )

        ExerciseMetricTypeService.createByName(
            exerciseName = "Bench Press",
            metricTypeName = "Reps"
        )

        val metrics = ExerciseMetricTypeService.getMetricsForExercise(exerciseId)

        assertEquals(2, metrics.size)
        assertTrue(metrics.any { it.name == "Weight" && it.unit == "kg" })
        assertTrue(metrics.any { it.name == "Reps" && it.unit == "reps" })
    }

    @Test
    fun `getMetricsForExercise returns empty list when exercise has no metric types`() {
        val exerciseId = createExercise(
            name = "Push Up",
            image = "pushup.png"
        )

        val metrics = ExerciseMetricTypeService.getMetricsForExercise(exerciseId)

        assertTrue(metrics.isEmpty())
    }

    @Test
    fun `getMetricsForExercise ignores metric types linked to other exercises`() {
        val benchId = createExercise(
            name = "Bench Press",
            image = "bench.png"
        )

        createExercise(
            name = "Running",
            image = "running.png"
        )

        createMetricType(
            name = "Weight",
            unit = "kg"
        )

        createMetricType(
            name = "Time",
            unit = "seconds"
        )

        ExerciseMetricTypeService.createByName(
            exerciseName = "Bench Press",
            metricTypeName = "Weight"
        )

        ExerciseMetricTypeService.createByName(
            exerciseName = "Running",
            metricTypeName = "Time"
        )

        val metrics = ExerciseMetricTypeService.getMetricsForExercise(benchId)

        assertEquals(1, metrics.size)
        assertEquals("Weight", metrics.first().name)
        assertEquals("kg", metrics.first().unit)
    }
}