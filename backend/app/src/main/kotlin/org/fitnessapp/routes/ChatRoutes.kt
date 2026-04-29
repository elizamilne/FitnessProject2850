package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

import org.fitnessapp.security.JWTService

import org.fitnessapp.models.ChatMessageDTO

import org.fitnessapp.services.ConversationParticipantService
import org.fitnessapp.services.ProfileService
import org.fitnessapp.services.UserService
import org.fitnessapp.services.MessageService


val rooms = mutableMapOf<Long, MutableList<DefaultWebSocketServerSession>>()

fun Route.chatRoutes() {

    webSocket("/chat") {
        // 1. Get conversationId
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

        // 2. Get token
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

        // 3. Verify token → get userId
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

        // 4. Get profile
        val profile = ProfileService.getProfileByUserId(userId)
            ?: run {
                close(
                    CloseReason(
                        CloseReason.Codes.CANNOT_ACCEPT,
                        "Profile not found"
                    )
                )
                return@webSocket
            }

        val profileId = profile.id
            ?: run {
                close(
                    CloseReason(
                        CloseReason.Codes.CANNOT_ACCEPT,
                        "Invalid profile"
                    )
                )
                return@webSocket
            }

        // 5. Check if user belongs to conversation
        val isParticipant =
            ConversationParticipantService.isUserInConversation(
                profileId,
                conversationId
            )

        if (!isParticipant) {
            close(
                CloseReason(
                    CloseReason.Codes.VIOLATED_POLICY,
                    "Not allowed"
                )
            )
            return@webSocket
        }

        // 6. Join room
        val sessionList =
            rooms.getOrPut(conversationId) { mutableListOf() }

        sessionList.add(this)

        try {
            for (frame in incoming) {

                if (frame is Frame.Text) {

                    val text = frame.readText()

                    // 7. Save message AND get saved entity
                    val savedMessage = MessageService.saveMessage(
                        profileId,
                        conversationId,
                        text
                    )

                    val user = UserService.findUserById(profile.userId)

                    val senderName = if (user != null) {
                        "${user.firstName} ${user.lastName}"
                    } else {
                        "Unknown"
                    }

                    // 8. Build DTO with createdAt
                    val messageDTO = ChatMessageDTO(
                        content = savedMessage.content,
                        profileId = savedMessage.profileId,
                        conversationId = conversationId,
                        createdAt = savedMessage.createdAt,
                        senderName = senderName
                    )

                    val json = Json.encodeToString(messageDTO)

                    // 9. Broadcast safely
                    sessionList.forEach {
                        try {
                            it.send(Frame.Text(json))
                        } catch (e: Exception) {
                            println("Failed to send message: ${e.message}")
                        }
                    }
                }
            }
        } finally {

            // 10. Cleanup on disconnect
            sessionList.remove(this)

            if (sessionList.isEmpty()) {
                rooms.remove(conversationId)
            }
        }
    }
}