package com.payment.user_service.service;




import com.payment.user_service.model.User;
import com.payment.user_service.model.UserPrincipal;
import com.payment.user_service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = repo.findByEmail(username);

        if(user == null) {
            System.out.println("User 404");
            throw new UsernameNotFoundException("User not found - 404");
        }

        return new UserPrincipal(user);
    }
}
