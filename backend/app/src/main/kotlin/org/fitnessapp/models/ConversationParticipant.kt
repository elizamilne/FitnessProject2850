package org.fitnessapp.models

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

import kotlinx.serialization.Serializable

object ConversationParticipant : Table("conversation_participant") {

    val conversationId = reference("conversation_id", Conversation.id)
    val profileId = reference("profile_id", Profile.id)

    val joinedAt = datetime("joined_at")
        .clientDefault { LocalDateTime.now() }

    override val primaryKey = PrimaryKey(conversationId, profileId)
}

@Serializable
data class StartChatRequest(
    val user1: Long,
    val user2: Long
)

