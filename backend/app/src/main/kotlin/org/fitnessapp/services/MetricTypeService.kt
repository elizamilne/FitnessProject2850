package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.MetricType
import org.fitnessapp.models.MetricTypeDTO

fun ResultRow.toMetricTypeDTO() = MetricTypeDTO(
    id = this[MetricType.id],
    name = this[MetricType.name]
)

object MetricTypeService {
    fun findAllMetricTypes(): List<MetricTypeDTO> = transaction {
        MetricType.selectAll().map {
            it.toMetricTypeDTO()
        }
    }

    fun findMetricTypeById(id: Long): MetricTypeDTO? = transaction {
        MetricType.selectAll()
            .where { MetricType.id eq id }
            .map { it.toMetricTypeDTO() }
            .singleOrNull()
    }

    fun metricTypeExists(metricTypeId: Long): Boolean {
        return MetricType
            .selectAll()
            .where { MetricType.id eq metricTypeId }
            .any()
    }
}