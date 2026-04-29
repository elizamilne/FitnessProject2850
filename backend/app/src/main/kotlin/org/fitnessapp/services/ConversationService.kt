package org.fitnessapp.services

import org.fitnessapp.models.Conversation
import org.fitnessapp.models.ConversationParticipant

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.transactions.transaction
import org.fitnessapp.models.ConversationDTO

object ConversationService {
    fun getUserConversations(profileId: Long, type: String?): List<ConversationDTO> {
        return transaction {

            val baseQuery = (Conversation innerJoin ConversationParticipant)
                .selectAll()
                .where { ConversationParticipant.profileId eq profileId }

            val filteredQuery = when (type) {
                "group" -> baseQuery.andWhere { Conversation.isGroup eq true }
                "chat"  -> baseQuery.andWhere { Conversation.isGroup eq false }
                else    -> baseQuery 
            }

            filteredQuery.map {
                ConversationDTO(
                    conversationId = it[Conversation.id],
                    isGroup = it[Conversation.isGroup]
                )
            }
        }
    }

    fun findPrivateConversation(user1: Long, user2: Long): Long? {
        return transaction {
            val rows = ConversationParticipant
                .selectAll()
                .where {
                    (ConversationParticipant.profileId eq user1) or
                    (ConversationParticipant.profileId eq user2)
                }
                .toList()

            val grouped = rows.groupBy {
                it[ConversationParticipant.conversationId] 
            }

            grouped.entries.firstOrNull { entry ->
                val users = entry.value.map {
                    it[ConversationParticipant.profileId] 
                }.toSet()

                users.containsAll(listOf(user1, user2))
            }?.key
        }
    }

    fun createConversation(isGroup: Boolean = false): Long {
        return transaction {
            Conversation.insert {
                it[Conversation.isGroup] = isGroup
            } get Conversation.id
        }
    }
}