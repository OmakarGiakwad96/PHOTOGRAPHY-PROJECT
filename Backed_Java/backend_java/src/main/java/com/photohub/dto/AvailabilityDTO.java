package com.photohub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityDTO {
    private Long id;
    private Long photographerId;
    private LocalDate date;
    private Boolean isAvailable;
    private Boolean isDeleted;
}
