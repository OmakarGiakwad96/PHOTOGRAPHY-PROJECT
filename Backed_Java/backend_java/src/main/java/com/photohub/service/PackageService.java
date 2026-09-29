package com.photohub.service;

import com.photohub.dto.PackageDTO;
import com.photohub.model.Package;
import com.photohub.model.Photographer;
import com.photohub.repository.PackageRepository;
import com.photohub.repository.PhotographerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PackageService {

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private PhotographerRepository photographerRepository;

    public PackageDTO createPackage(PackageDTO dto) {
        Photographer photographer = photographerRepository.findById(dto.getPhotographerId())
                .orElseThrow(() -> new RuntimeException("Photographer not found"));

        Package pkg = Package.builder()
                .photographer(photographer)
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .durationHours(dto.getDurationHours())
                .features(dto.getFeatures())
                .isDeleted(false)
                .build();

        Package saved = packageRepository.save(pkg);
        return mapToDTO(saved);
    }

    public List<PackageDTO> getPackagesByPhotographer(Long photographerId) {
        return packageRepository.findByPhotographer_PhotographerIdAndIsDeletedFalse(photographerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PackageDTO mapToDTO(Package p) {
        return PackageDTO.builder()
                .packageId(p.getPackageId())
                .photographerId(p.getPhotographer().getPhotographerId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .durationHours(p.getDurationHours())
                .features(p.getFeatures())
                .build();
    }
}
