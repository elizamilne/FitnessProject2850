package org.fitnessapp.services

import org.fitnessapp.models.MetricType
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class MetricTypeServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:metric_type_test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(MetricType)
            SchemaUtils.create(MetricType)
        }
    }

    private fun createMetricType(
        name: String,
        unit: String
    ): Long {
        return transaction {
            MetricType.insert {
                it[MetricType.name] = name
                it[MetricType.unit] = unit
            } get MetricType.id
        }
    }

    @Test
    fun `findAllMetricTypes returns all metric types`() {
        createMetricType("Weight", "kg")
        createMetricType("Reps", "reps")
        createMetricType("Time", "seconds")

        val metricTypes = MetricTypeService.findAllMetricTypes()

        assertEquals(3, metricTypes.size)
        assertTrue(metricTypes.any { it.name == "Weight" && it.unit == "kg" })
        assertTrue(metricTypes.any { it.name == "Reps" && it.unit == "reps" })
        assertTrue(metricTypes.any { it.name == "Time" && it.unit == "seconds" })
    }

    @Test
    fun `findAllMetricTypes returns empty list when there are no metric types`() {
        val metricTypes = MetricTypeService.findAllMetricTypes()

        assertTrue(metricTypes.isEmpty())
    }

    @Test
    fun `findMetricTypeById returns metric type when it exists`() {
        val id = createMetricType("Distance", "km")

        val metricType = requireNotNull(
            MetricTypeService.findMetricTypeById(id)
        )

        assertEquals(id, metricType.id)
        assertEquals("Distance", metricType.name)
        assertEquals("km", metricType.unit)
    }

    @Test
    fun `findMetricTypeById returns null when metric type does not exist`() {
        val metricType = MetricTypeService.findMetricTypeById(999L)

        assertNull(metricType)
    }

    @Test
    fun `metricTypeExists returns true when metric type exists`() {
        val id = createMetricType("Calories", "kcal")

        val exists = transaction {
            MetricTypeService.metricTypeExists(id)
        }

        assertTrue(exists)
    }

    @Test
    fun `metricTypeExists returns false when metric type does not exist`() {
        val exists = transaction {
            MetricTypeService.metricTypeExists(999L)
        }

        assertFalse(exists)
    }

    @Test
    fun `toMetricTypeDTO converts result row to dto`() {
        val id = createMetricType("Speed", "kmh")

        val metricType = requireNotNull(
            MetricTypeService.findMetricTypeById(id)
        )

        assertEquals(id, metricType.id)
        assertEquals("Speed", metricType.name)
        assertEquals("kmh", metricType.unit)
    }
}