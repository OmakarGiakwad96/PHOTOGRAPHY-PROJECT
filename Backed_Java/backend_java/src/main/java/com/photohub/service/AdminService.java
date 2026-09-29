package com.photohub.service;

import com.photohub.dto.BookingDTO;
import com.photohub.dto.PhotographerDTO;
import com.photohub.dto.ClientDTO;
import com.photohub.model.Booking;
import com.photohub.model.Photographer;
import com.photohub.model.Client;
import com.photohub.repository.BookingRepository;
import com.photohub.repository.PhotographerRepository;
import com.photohub.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PhotographerRepository photographerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", clientRepository.count());
        stats.put("totalPhotographers", photographerRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        return stats;
    }

    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .filter(u -> !u.isDeleted())
                .map(this::mapClientToDTO)
                .collect(Collectors.toList());
    }

    public List<PhotographerDTO> getAllPhotographers() {
        return photographerRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .map(this::mapPhotographerToDTO)
                .collect(Collectors.toList());
    }

    public PhotographerDTO verifyPhotographer(Long id, boolean status) {
        Photographer photographer = photographerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photographer not found"));
        photographer.setVerified(status);
        Photographer updated = photographerRepository.save(photographer);
        return mapPhotographerToDTO(updated);
    }

    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        client.setDeleted(true);
        clientRepository.save(client);
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .filter(b -> !b.isDeleted())
                .map(this::mapBookingToDTO)
                .collect(Collectors.toList());
    }

    // Helper mapping methods
    private ClientDTO mapClientToDTO(Client client) {
        return ClientDTO.builder()
                .clientId(client.getClientId())
                .name(client.getName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .role(client.getRole().name())
                .profilePicture(client.getProfilePicture())
                .status(client.getStatus())
                .build();
    }

    private PhotographerDTO mapPhotographerToDTO(Photographer p) {
        return PhotographerDTO.builder()
                .photographerId(p.getPhotographerId())
                .userId(p.getPhotographerId()) // Adjusting because User is gone
                .name(p.getName())
                .experience(p.getExperience())
                .bio(p.getBio())
                .location(p.getLocation())
                .rating(p.getRating())
                .pricePerHour(p.getPricePerHour())
                .isVerified(p.isVerified())
                .coverImage(p.getCoverImage())
                .specialties(p.getSpecialties())
                .build();
    }

    private BookingDTO mapBookingToDTO(Booking b) {
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
