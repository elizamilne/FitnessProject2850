package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.ReferenceOption

import kotlinx.serialization.Serializable

object ProgramSchedule : Table("program_schedule") {
    val id = long("id").autoIncrement()
    val day = varchar("day", 255)
    val programId = reference(
        "program_id", 
        Program.id,
        onDelete = ReferenceOption.CASCADE
    )
    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex("unique_day_per_program", day, programId)
    }
}

@Serializable
data class ProgramScheduleDTO(
    val id: Long? = null,
    val day: String,
    val programId: Long
)

@Serializable
data class CreateProgramScheduleRequest(
    val day: String,
    val programId: Long 
)
