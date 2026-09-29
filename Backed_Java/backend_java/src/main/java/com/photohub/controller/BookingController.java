package com.photohub.controller;

import com.photohub.dto.BookingDTO;
import com.photohub.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO dto) {
        return ResponseEntity.ok(bookingService.createBooking(dto));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<BookingDTO>> getClientBookings(@PathVariable Long clientId) {
        return ResponseEntity.ok(bookingService.getUserBookings(clientId));
    }

    @GetMapping("/photographer/{photographerId}")
    public ResponseEntity<List<BookingDTO>> getPhotographerBookings(@PathVariable Long photographerId) {
        return ResponseEntity.ok(bookingService.getPhotographerBookings(photographerId));
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(@PathVariable Long bookingId, @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status));
    }
}
