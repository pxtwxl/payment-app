package com.payment.user_service.repo;

import com.payment.user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {
    public User findByEmail(String email);
    public User findByUpiId(String upiId);

    public User findByPhone(Long phone);
}
