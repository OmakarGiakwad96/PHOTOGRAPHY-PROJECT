package com.photohub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.photohub.model.PackageImage;

@Repository
public interface PackageImageRepository extends JpaRepository<PackageImage, Long> {}
