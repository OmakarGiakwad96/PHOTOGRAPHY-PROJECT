package com.photohub.controller;

import com.photohub.dto.PackageDTO;
import com.photohub.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    @PostMapping
    public ResponseEntity<PackageDTO> createPackage(@RequestBody PackageDTO dto) {
        return ResponseEntity.ok(packageService.createPackage(dto));
    }

    @GetMapping("/photographer/{photographerId}")
    public ResponseEntity<List<PackageDTO>> getPackagesByPhotographer(@PathVariable Long photographerId) {
        return ResponseEntity.ok(packageService.getPackagesByPhotographer(photographerId));
    }
}
