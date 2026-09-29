package com.photohub.service;

import com.photohub.dto.PhotographerDTO;
import com.photohub.model.Photographer;
import com.photohub.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.photohub.repository.PhotographerRepository;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhotographerService {

    @Autowired
    private PhotographerRepository photographerRepository;

    public List<PhotographerDTO> getAllPhotographers() {
        return photographerRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PhotographerDTO getPhotographerById(Long id) {
        Photographer photographer = photographerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Photographer not found"));
        return mapToDTO(photographer);
    }

    public List<PhotographerDTO> searchPhotographersByLocation(String location) {
        return photographerRepository.findByLocationContainingIgnoreCase(location).stream()
                .filter(p -> !p.isDeleted())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<PhotographerDTO> searchPhotographersByCategory(String category) {
        return photographerRepository.findBySpecialtiesContainingIgnoreCase(category).stream()
                .filter(p -> !p.isDeleted())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PhotographerDTO updatePhotographerProfile(Long id, PhotographerDTO dto) {
        Photographer photographer = photographerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Photographer not found"));

        if (dto.getExperience() != null) photographer.setExperience(dto.getExperience());
        if (dto.getBio() != null) photographer.setBio(dto.getBio());
        if (dto.getLocation() != null) photographer.setLocation(dto.getLocation());
        if (dto.getPricePerHour() != null) photographer.setPricePerHour(dto.getPricePerHour());
        if (dto.getCoverImage() != null) photographer.setCoverImage(dto.getCoverImage());
        if (dto.getSpecialties() != null) photographer.setSpecialties(dto.getSpecialties());

        Photographer updated = photographerRepository.save(photographer);
        return mapToDTO(updated);
    }

    private PhotographerDTO mapToDTO(Photographer p) {
        return PhotographerDTO.builder()
                .photographerId(p.getPhotographerId())
                .userId(p.getPhotographerId()) // Client/Photographer unified ID concept in DTO
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
}
