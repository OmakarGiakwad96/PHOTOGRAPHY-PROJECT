package com.photohub.repository;

import com.photohub.model.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {
    List<Package> findByPhotographer_PhotographerIdAndIsDeletedFalse(Long photographerId);
}
