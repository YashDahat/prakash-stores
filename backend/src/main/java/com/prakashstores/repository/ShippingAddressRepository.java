package com.prakashstores.repository;

import com.prakashstores.model.ShippingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, UUID> {}
