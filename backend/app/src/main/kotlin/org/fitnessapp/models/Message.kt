package org.fitnessapp.models

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

import java.time.Instant

import kotlinx.serialization.Serializable

object Message : Table("message") {
    val id = long("id").autoIncrement()
    val content = text("content")
    val profileId = reference("profile_id", Profile.id)
    val conversationId = reference("conversation_id", Conversation.id)

    val createdAt = timestamp("created_at")
        .clientDefault { Instant.now() }

    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class MessageDTO(
    val id: Long,
    val content: String,
    val profileId: Long,
    val createdAt: String,
    val senderName: String,
)

@Serializable
data class ChatMessageDTO(
    val content: String,
    val profileId: Long,
    val conversationId: Long,
    val createdAt: String,
    val senderName: String
)