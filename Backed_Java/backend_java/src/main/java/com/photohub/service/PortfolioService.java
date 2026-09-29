package com.photohub.service;

import com.photohub.dto.PortfolioDTO;
import com.photohub.model.Photographer;
import com.photohub.model.Portfolio;
import com.photohub.repository.PhotographerRepository;
import com.photohub.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private PhotographerRepository photographerRepository;

    public PortfolioDTO addPortfolioItem(PortfolioDTO dto) {
        Photographer photographer = photographerRepository.findById(dto.getPhotographerId())
                .orElseThrow(() -> new RuntimeException("Photographer not found"));

        Portfolio portfolio = Portfolio.builder()
                .photographer(photographer)
                .imageUrl(dto.getImageUrl())
                .title(dto.getTitle())
                .category(dto.getCategory())
                .isDeleted(false)
                .build();

        Portfolio saved = portfolioRepository.save(portfolio);
        return mapToDTO(saved);
    }

    public List<PortfolioDTO> getPortfolioByPhotographer(Long photographerId) {
        return portfolioRepository.findByPhotographer_PhotographerIdAndIsDeletedFalse(photographerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deletePortfolioItem(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio item not found"));
        portfolio.setDeleted(true);
        portfolioRepository.save(portfolio);
    }

    private PortfolioDTO mapToDTO(Portfolio p) {
        return PortfolioDTO.builder()
                .portfolioId(p.getPortfolioId())
                .photographerId(p.getPhotographer().getPhotographerId())
                .imageUrl(p.getImageUrl())
                .title(p.getTitle())
                .category(p.getCategory())
                .build();
    }
}
