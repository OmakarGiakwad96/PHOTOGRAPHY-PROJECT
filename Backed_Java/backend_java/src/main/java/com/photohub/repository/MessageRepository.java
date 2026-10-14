package com.photohub.repository;

import com.photohub.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.senderId = :u1 AND m.receiverId = :u2) OR (m.senderId = :u2 AND m.receiverId = :u1) ORDER BY m.sentAt ASC")
    List<Message> findConversationBetweenUsers(@Param("u1") Long u1, @Param("u2") Long u2);

    List<Message> findByBookingIdOrderBySentAtAsc(Long bookingId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :receiverId AND m.isRead = false")
    long countUnreadMessagesForUser(@Param("receiverId") Long receiverId);

    List<Message> findByReceiverIdAndSenderIdAndIsReadFalse(Long receiverId, Long senderId);
}
