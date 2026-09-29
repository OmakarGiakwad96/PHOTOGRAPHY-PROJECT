package com.photohub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupon_usages")
public class CouponUsage {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @ManyToOne
 @JoinColumn(name = "coupon_id")
 private Coupon coupon;

 @ManyToOne
 @JoinColumn(name = "client_id")
 private Client client;

 private LocalDateTime usedAt = LocalDateTime.now();
 // getters and setters
}
