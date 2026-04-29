package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

import org.fitnessapp.services.MessageService
import org.fitnessapp.security.JWTService
import org.fitnessapp.services.ConversationParticipantService
import org.fitnessapp.services.ProfileService

val rooms = mutableMapOf<Long, MutableList<DefaultWebSocketServerSession>>()

@Serializable
data class ChatMessage(
    val content: String,
    val profileId: Long,
    val conversationId: Long
)

fun Route.chatRoutes() {

    webSocket("/chat") {
        // ConversationId (safe)
        val conversationId =
            call.request.queryParameters["conversationId"]?.toLongOrNull()
                ?: run {
                    close(
                        CloseReason(
                            CloseReason.Codes.CANNOT_ACCEPT,
                            "Invalid conversationId"
                        )
                    )
                    return@webSocket
                }
        
        // Token
        val token =
            call.request.queryParameters["token"]
                ?: run {
                    close(
                        CloseReason(
                            CloseReason.Codes.CANNOT_ACCEPT,
                            "Missing token"
                        )
                    )
                    return@webSocket
                }
            
        // Extract userId from JWT
        val userId =
            JWTService.verifyToken(token)
                ?: run {
                    close(
                        CloseReason(
                            CloseReason.Codes.CANNOT_ACCEPT,
                            "Invalid token"
                        )
                    )
                    return@webSocket
                }

        val profile = ProfileService.getProfileByUserId(userId)
            ?: run {
                close(CloseReason(CloseReason.Codes.CANNOT_ACCEPT, "Profile not found"))
                return@webSocket
            }

        val profileId = profile.id
            ?: run {
                close(CloseReason(CloseReason.Codes.CANNOT_ACCEPT, "Invalid profile"))
                return@webSocket
            }
        
        // Check if user belongs to conversation

        val isParticipant =
            ConversationParticipantService.isUserInConversation(profileId, conversationId)

        if (!isParticipant) {
            close(
                CloseReason(
                    CloseReason.Codes.VIOLATED_POLICY,
                    "Not allowed"
                )
            )
            return@webSocket
        }
        
        // Join room
        val sessionList =
            rooms.getOrPut(conversationId) { mutableListOf() }

        sessionList.add(this)

        try {
            for (frame in incoming) {

                if (frame is Frame.Text) {

                    val text = frame.readText()

                    // Save message
                    MessageService.saveMessage(
                        profileId,
                        conversationId,
                        text
                    )

                    // Build message DTO
                    val message = ChatMessage(
                        content = text,
                        profileId = profileId,
                        conversationId = conversationId
                    )

                    val json = Json.encodeToString(message)

                    // Broadcast to all users in room
                    sessionList.forEach {
                        it.send(Frame.Text(json))
                    }
                }
            }
        } finally {

            // Remove session on disconnect
            sessionList.remove(this)

            if (sessionList.isEmpty()) {
                rooms.remove(conversationId)
            }
        }
    }
}