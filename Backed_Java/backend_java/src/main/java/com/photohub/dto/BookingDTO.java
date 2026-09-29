package com.photohub.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class BookingDTO {
    private Long bookingId;
    private Long userId;
    private Long photographerId;
    private Long packageId;
    private String eventId;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String location;
    private String specialRequirements;
    private Double totalPrice;
    private String bookingStatus;
}
