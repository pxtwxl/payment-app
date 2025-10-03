package com.payment.user_service.repo;

import com.payment.user_service.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepo extends JpaRepository<Payment,Long> {
    public Payment findByRequestId(String requestId);
}
