package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.MetricType
import org.fitnessapp.models.MetricTypeDTO

private fun ResultRow.toMetricTypeDTO() = MetricTypeDTO(
    id = this[MetricType.id],
    name = this[MetricType.name]
)

private fun findAllMetricTypes(): List<MetricTypeDTO> = transaction {
    MetricType.selectAll().map {
        it.toMetricTypeDTO()
    }
}

private fun findMetricTypeById(id: Long): MetricTypeDTO? = transaction {
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

fun Route.metricTypeRoutes() { 
    route("/metrics") {
        get {
            val metricTypes = findAllMetricTypes()

            if (metricTypes.isEmpty()) {
                call.respond(HttpStatusCode.NotFound, "Metric Types not found")
            } else {
                call.respond(HttpStatusCode.OK, metricTypes)
            }
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            val metricType = findMetricTypeById(id)

            if (metricType == null) {
                call.respond(HttpStatusCode.NotFound, "Metric Type not found")
            } else {
                call.respond(HttpStatusCode.OK, metricType)
            }
        }
    }
}