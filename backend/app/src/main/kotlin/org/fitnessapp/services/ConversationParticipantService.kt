package org.fitnessapp.services

import org.fitnessapp.models.ConversationParticipant

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.insertIgnore

object ConversationParticipantService {
    fun addParticipant(conversationId: Long, profileId: Long) {
        transaction {
            ConversationParticipant.insertIgnore {
                it[ConversationParticipant.conversationId] = conversationId
                it[ConversationParticipant.profileId] = profileId
            }
        }
    }

    fun isUserInConversation(profileId: Long, conversationId: Long): Boolean {
        return transaction {
            ConversationParticipant
                .selectAll()
                .where {
                    (ConversationParticipant.profileId eq profileId).and(
                        ConversationParticipant.conversationId eq conversationId)
                }
                .count() > 0
        }
    }
}