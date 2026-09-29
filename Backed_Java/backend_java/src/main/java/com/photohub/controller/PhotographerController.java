package com.photohub.controller;

import com.photohub.dto.PhotographerDTO;
import com.photohub.service.PhotographerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/photographers")
public class PhotographerController {

    @Autowired
    private PhotographerService photographerService;

    @GetMapping
    public ResponseEntity<List<PhotographerDTO>> getAllPhotographers() {
        return ResponseEntity.ok(photographerService.getAllPhotographers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotographerDTO> getPhotographerById(@PathVariable Long id) {
        return ResponseEntity.ok(photographerService.getPhotographerById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PhotographerDTO>> searchPhotographers(@RequestParam(required = false) String location,
                                                                     @RequestParam(required = false) String category) {
        if (location != null) {
            return ResponseEntity.ok(photographerService.searchPhotographersByLocation(location));
        } else if (category != null) {
            return ResponseEntity.ok(photographerService.searchPhotographersByCategory(category));
        }
        return ResponseEntity.ok(photographerService.getAllPhotographers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhotographerDTO> updatePhotographerProfile(@PathVariable Long id, @RequestBody PhotographerDTO dto) {
        return ResponseEntity.ok(photographerService.updatePhotographerProfile(id, dto));
    }
}
