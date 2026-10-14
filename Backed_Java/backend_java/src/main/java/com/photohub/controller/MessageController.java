package com.photohub.controller;

import com.photohub.model.Message;
import com.photohub.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/conversation")
    public ResponseEntity<?> getConversation(
            @RequestParam(required = false) Long userId1,
            @RequestParam(required = false) Long userId2,
            @RequestParam(required = false) Long bookingId) {

        List<Message> messages;
        if (bookingId != null && bookingId > 0) {
            messages = messageRepository.findByBookingIdOrderBySentAtAsc(bookingId);
        } else if (userId1 != null && userId2 != null) {
            messages = messageRepository.findConversationBetweenUsers(userId1, userId2);
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Either bookingId or both userId1 and userId2 are required"));
        }

        return ResponseEntity.ok(messages);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message content cannot be empty"));
        }
        if (message.getContent().length() > 2000) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message content cannot exceed 2000 characters"));
        }
        if (message.getSenderId() == null || message.getReceiverId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Sender ID and Receiver ID are required"));
        }

        message.setIsRead(false);
        message.setSentAt(LocalDateTime.now());
        Message saved = messageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/read")
    public ResponseEntity<?> markAsRead(@RequestParam Long receiverId, @RequestParam Long senderId) {
        List<Message> unread = messageRepository.findByReceiverIdAndSenderIdAndIsReadFalse(receiverId, senderId);
        LocalDateTime now = LocalDateTime.now();
        unread.forEach(m -> {
            m.setIsRead(true);
            m.setReadAt(now);
        });
        messageRepository.saveAll(unread);
        return ResponseEntity.ok(Map.of("success", true, "markedCount", unread.size()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@RequestParam Long userId) {
        long count = messageRepository.countUnreadMessagesForUser(userId);
        return ResponseEntity.ok(Map.of("userId", userId, "unreadCount", count));
    }
}
