package com.photohub.controller;

import com.photohub.dto.PortfolioDTO;
import com.photohub.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @PostMapping
    public ResponseEntity<PortfolioDTO> addPortfolioItem(@RequestBody PortfolioDTO dto) {
        return ResponseEntity.ok(portfolioService.addPortfolioItem(dto));
    }

    @GetMapping("/photographer/{photographerId}")
    public ResponseEntity<List<PortfolioDTO>> getPortfolioByPhotographer(@PathVariable Long photographerId) {
        return ResponseEntity.ok(portfolioService.getPortfolioByPhotographer(photographerId));
    }

    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<Void> deletePortfolioItem(@PathVariable Long portfolioId) {
        portfolioService.deletePortfolioItem(portfolioId);
        return ResponseEntity.noContent().build();
    }
}
