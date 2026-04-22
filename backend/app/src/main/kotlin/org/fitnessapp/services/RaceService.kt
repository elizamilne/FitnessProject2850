package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.update
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.SortOrder

import java.time.LocalDate

import org.fitnessapp.models.Race
import org.fitnessapp.models.RaceDTO
import org.fitnessapp.models.CreateRaceRequest
import org.fitnessapp.models.UpdateRaceRequest

fun ResultRow.toRaceDTO() = RaceDTO(
    id = this[Race.id],
    profileId = this[Race.profileId],
    title = this[Race.title],
    location = this[Race.location],
    date = this[Race.date].toString(),
    bannerUrl = this[Race.bannerUrl],
    completed = this[Race.completed]
)

object RaceService {
    fun updateRace(
        builder: UpdateBuilder<*>, 
        request: UpdateRaceRequest
    ) {
        builder[Race.title] = request.title
        builder[Race.location] = request.location
        builder[Race.date] = LocalDate.parse(request.date)
        builder[Race.bannerUrl] = request.bannerUrl
        builder[Race.completed] = request.completed
    }

    fun createRace(
        builder: InsertStatement<*>,
        request: CreateRaceRequest
    ) {
        builder[Race.profileId] = request.profileId
        builder[Race.title] = request.title
        builder[Race.location] = request.location
        builder[Race.date] = LocalDate.parse(request.date)
        builder[Race.bannerUrl] = request.bannerUrl
    }

    fun getAllRaces(): List<RaceDTO> {
        return transaction {
            Race.selectAll()
                .map { it.toRaceDTO() }
            }
    }

    fun findRaceById(id: Long): RaceDTO? = transaction {
        Race
            .selectAll()
            .where { Race.id eq id }
            .map { it.toRaceDTO() }
            .singleOrNull()
    }

    fun toggleRaceCompleted(id: Long): RaceDTO? = transaction {
        val row = Race
            .selectAll()
            .where { Race.id eq id }
            .singleOrNull()
            ?: return@transaction null

        val newState = !row[Race.completed]

        Race.update({ Race.id eq id }) {
            it[completed] = newState
        }

        RaceDTO(
            id = row[Race.id],
            profileId = row[Race.profileId],
            title = row[Race.title],
            location = row[Race.location],
            date = row[Race.date].toString(),
            bannerUrl = row[Race.bannerUrl],
            completed = newState
        )
    }

    fun getNextIncompleteRace(profileId: Long): RaceDTO? = transaction {
        Race
            .selectAll()
            .where {
                (Race.completed eq false) and
                (Race.profileId eq profileId)
            }
            .orderBy(Race.date to SortOrder.ASC)
            .limit(1)
            .map { it.toRaceDTO() }
            .singleOrNull()
    }  

    fun createRaceAndReturnId(request: CreateRaceRequest): Long = transaction {
        Race.insert { builder ->
            createRace(builder, request)
        } get Race.id
    }

    fun updateRaceById(id: Long, request: UpdateRaceRequest): Int = transaction {
        Race.update({ Race.id eq id }) { builder ->
            updateRace(builder, request)
        }
    }

    fun deleteRaceById(id: Long): Int = transaction {
        Race.deleteWhere { Race.id eq id }
    }
}