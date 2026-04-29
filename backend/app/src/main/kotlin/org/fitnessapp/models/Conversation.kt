package org.fitnessapp.models

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

import kotlinx.serialization.Serializable

object Conversation : Table("conversation") {
    val id = long("id").autoIncrement()
    val isGroup = bool("is_group")
    val createdAt = datetime("created_at")
        .clientDefault { LocalDateTime.now() }

    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class CreateGroupRequest(
    val participants: List<Long>
)

@Serializable
data class ConversationDTO(
    val conversationId: Long,
    val isGroup: Boolean
)