package org.fitnessapp.services

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

import org.fitnessapp.models.Message
import org.fitnessapp.models.MessageDTO

object MessageService {

    fun saveMessage(profileId: Long, conversationId: Long, content: String) {
        transaction {
            Message.insert {
                it[Message.profileId] = profileId
                it[Message.conversationId] = conversationId
                it[Message.content] = content
            }
        }
    }

    fun getMessages(conversationId: Long): List<MessageDTO> {
        return transaction {
            Message
                .selectAll()
                .where { Message.conversationId eq conversationId }
                .orderBy(Message.createdAt to SortOrder.ASC)
                .map {
                    MessageDTO(
                        id = it[Message.id],
                        content = it[Message.content],
                        profileId = it[Message.profileId],   
                        createdAt = it[Message.createdAt].toString() 
                    )
                }
        }
    }
}