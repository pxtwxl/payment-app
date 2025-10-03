package com.payment.npci_switch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class NpciSwitchApplication {

	public static void main(String[] args) {
		SpringApplication.run(NpciSwitchApplication.class, args);
	}

}
