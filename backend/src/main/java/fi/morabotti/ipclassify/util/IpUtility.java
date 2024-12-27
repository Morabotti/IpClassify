package fi.morabotti.ipclassify.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class IpUtility {
    @Value("${local.public.ip}")
    private String publicIp;

    public String convertPrivateIpToPublic(String ip) {
        if (ip.equals("127.0.0.1") || ip.equals("0.0.0.0")) {
            return publicIp;
        }

        return ip;
    }
}
