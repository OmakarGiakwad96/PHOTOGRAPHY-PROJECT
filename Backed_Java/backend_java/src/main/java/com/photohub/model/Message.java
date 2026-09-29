package com.photohub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(name = "sender_id")
 private Long senderId;

 @Column(name = "sender_type")
 private String senderType; // "CLIENT", "PHOTOGRAPHER", "ADMIN"

 @Column(name = "receiver_id")
 private Long receiverId;

 @Column(name = "receiver_type")
 private String receiverType;

 private String content;
 private LocalDateTime sentAt = LocalDateTime.now();
 // getters and setters
}
