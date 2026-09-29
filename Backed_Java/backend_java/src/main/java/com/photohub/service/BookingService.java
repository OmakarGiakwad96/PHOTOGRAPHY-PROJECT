package com.photohub.service;

import com.photohub.dto.BookingDTO;
import com.photohub.model.Booking;
import com.photohub.model.Package;
import com.photohub.model.Photographer;
import com.photohub.model.Client;
import com.photohub.repository.BookingRepository;
import com.photohub.repository.PackageRepository;
import com.photohub.repository.PhotographerRepository;
import com.photohub.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PhotographerRepository photographerRepository;

    @Autowired
    private PackageRepository packageRepository;

    public BookingDTO createBooking(BookingDTO dto) {
        Client client = clientRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        Photographer photographer = photographerRepository.findById(dto.getPhotographerId())
                .orElseThrow(() -> new RuntimeException("Photographer not found"));
        Package pkg = packageRepository.findById(dto.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        Booking booking = Booking.builder()
                .client(client)
                .photographer(photographer)
                .aPackage(pkg)
                .eventId("EVT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .bookingDate(dto.getBookingDate())
                .bookingTime(dto.getBookingTime())
                .location(dto.getLocation())
                .specialRequirements(dto.getSpecialRequirements())
                .totalPrice(pkg.getPrice()) // or derived from package logic
                .bookingStatus("Pending")
                .isDeleted(false)
                .build();

        Booking saved = bookingRepository.save(booking);
        return mapToDTO(saved);
    }

    public List<BookingDTO> getUserBookings(Long userId) {
        return bookingRepository.findByClient_ClientId(userId).stream()
                .filter(b -> !b.isDeleted())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getPhotographerBookings(Long photographerId) {
        return bookingRepository.findByPhotographer_PhotographerId(photographerId).stream()
                .filter(b -> !b.isDeleted())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setBookingStatus(status);
        return mapToDTO(bookingRepository.save(booking));
    }

    private BookingDTO mapToDTO(Booking b) {
        return BookingDTO.builder()
                .bookingId(b.getBookingId())
                .userId(b.getClient().getClientId())
                .photographerId(b.getPhotographer().getPhotographerId())
                .packageId(b.getAPackage().getPackageId())
                .eventId(b.getEventId())
                .bookingDate(b.getBookingDate())
                .bookingTime(b.getBookingTime())
                .location(b.getLocation())
                .specialRequirements(b.getSpecialRequirements())
                .totalPrice(b.getTotalPrice())
                .bookingStatus(b.getBookingStatus())
                .build();
    }
}
