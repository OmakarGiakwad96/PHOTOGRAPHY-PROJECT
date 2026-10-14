package com.photohub.repository;

import com.photohub.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findFirstByIdentifierAndPurposeAndConsumedFalseOrderByCreatedAtDesc(
            String identifier, String purpose);

    Optional<OtpVerification> findByTokenHashAndConsumedFalse(String tokenHash);

    List<OtpVerification> findByIdentifierAndConsumedFalse(String identifier);

    @Query("SELECT COUNT(o) FROM OtpVerification o WHERE o.identifier = :identifier AND o.createdAt >= :since")
    long countByIdentifierSince(@Param("identifier") String identifier, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(o) FROM OtpVerification o WHERE o.ipAddress = :ipAddress AND o.createdAt >= :since")
    long countByIpAddressSince(@Param("ipAddress") String ipAddress, @Param("since") LocalDateTime since);
}
