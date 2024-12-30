package fi.morabotti.ipclassify.util;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Stream;

public class MockUtility {
    public static List<String> referrerList = Stream.of(
            "Facebook",
            "Youtube",
            "Instagram",
            "Twitter",
            "BlueSky",
            "Google",
            "Netflix",
            "Reddit"
    ).toList();

    public static List<String> applicationList = Stream.of(
            "Facebook",
            "IpClassify",
            "Youtube",
            "StackOverflow",
            "Wikipedia",
            "BlueSky",
            "Google",
            "Netflix",
            "Reddit"
    ).toList();

    public static List<String> userAgentList = Stream.of(
            "Mozilla/5.0 (compatible; MSIE 9.0; Windows; Windows NT 6.0; Win64; x64 Trident/5.0)",
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 8_5_7; en-US) Gecko/20100101 Firefox/50.3",
            "Mozilla/5.0 (Windows; U; Windows NT 10.3; x64) AppleWebKit/534.33 (KHTML, like Gecko) Chrome/49.0.3938.388 Safari/603.5 Edge/13.91038",
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 7_8_7; en-US) Gecko/20130401 Firefox/48.6",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_1_6) Gecko/20130401 Firefox/58.6",
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_0; en-US) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/50.0.2263.140 Safari/535",
            "Mozilla/5.0 (U; Linux i561 ) AppleWebKit/534.9 (KHTML, like Gecko) Chrome/51.0.3529.114 Safari/537",
            "Mozilla/5.0 (Linux i574 x86_64; en-US) Gecko/20100101 Firefox/49.6",
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_10_5) Gecko/20130401 Firefox/63.2",
            "Mozilla/5.0 (U; Linux i553 ) Gecko/20130401 Firefox/48.1",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 9_4_2; en-US) Gecko/20100101 Firefox/45.4",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 7_5_7; en-US) AppleWebKit/533.23 (KHTML, like Gecko) Chrome/55.0.2445.171 Safari/533",
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_0) AppleWebKit/535.23 (KHTML, like Gecko) Chrome/54.0.2760.369 Safari/537",
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_7_3) AppleWebKit/603.43 (KHTML, like Gecko) Chrome/48.0.1994.371 Safari/602",
            "Mozilla/5.0 (Linux; U; Linux x86_64) Gecko/20100101 Firefox/51.2",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) Gecko/20100101 Firefox/47.8",
            "Mozilla/5.0 (Linux; U; Linux i663 ) AppleWebKit/600.26 (KHTML, like Gecko) Chrome/51.0.2746.311 Safari/601",
            "Mozilla/5.0 (Linux; Linux x86_64) AppleWebKit/601.17 (KHTML, like Gecko) Chrome/48.0.3297.162 Safari/603",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_9; like Mac OS X) AppleWebKit/602.24 (KHTML, like Gecko)  Chrome/48.0.3492.109 Mobile Safari/534.3",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_5; like Mac OS X) AppleWebKit/601.16 (KHTML, like Gecko)  Chrome/53.0.1850.121 Mobile Safari/600.8",
            "Mozilla/5.0 (Linux; Linux x86_64) AppleWebKit/536.23 (KHTML, like Gecko) Chrome/50.0.1681.379 Safari/535",
            "Mozilla/5.0 (Windows NT 10.2; Win64; x64) AppleWebKit/535.39 (KHTML, like Gecko) Chrome/54.0.3494.253 Safari/602.7 Edge/15.44480",
            "Mozilla/5.0 (Windows NT 10.5; Win64; x64) AppleWebKit/601.6 (KHTML, like Gecko) Chrome/50.0.3046.177 Safari/602.9 Edge/18.21673",
            "Mozilla/5.0 (Windows; U; Windows NT 10.3; WOW64) Gecko/20130401 Firefox/48.6",
            "Mozilla/5.0 (Windows; Windows NT 10.1;) AppleWebKit/533.31 (KHTML, like Gecko) Chrome/48.0.3912.229 Safari/602",
            "Mozilla/5.0 (iPod; CPU iPod OS 11_6_0; like Mac OS X) AppleWebKit/536.27 (KHTML, like Gecko)  Chrome/53.0.3557.194 Mobile Safari/536.3",
            "Mozilla/5.0 (iPod; CPU iPod OS 7_0_7; like Mac OS X) AppleWebKit/603.31 (KHTML, like Gecko)  Chrome/53.0.3086.233 Mobile Safari/535.1",
            "Mozilla/5.0 (Linux; U; Linux i643 x86_64) Gecko/20100101 Firefox/47.7",
            "Mozilla/5.0 (Linux i584 ) Gecko/20100101 Firefox/65.2",
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_1_1; en-US) Gecko/20130401 Firefox/59.0",
            "Mozilla/5.0 (Linux; U; Linux i580 ; en-US) Gecko/20130401 Firefox/50.4"
    )
            .toList();

    public static String getRandomApplication() {
        return applicationList.get(ThreadLocalRandom.current().nextInt(0, applicationList.size()));
    }

    public static String getRandomReferrer() {
        return referrerList.get(ThreadLocalRandom.current().nextInt(0, referrerList.size()));
    }

    public static String getRandomUserAgent() {
        return userAgentList.get(ThreadLocalRandom.current().nextInt(0, userAgentList.size()));
    }

    public static List<String> generateRandomIps(Long amount) {
        List<String> ipList = new ArrayList<>(amount.intValue());
        for (int i = 0; i < amount; i++) {
            ipList.add(generateRandomPublicIp());
        }
        return ipList;
    }

    private static String generateRandomPublicIp() {
        int firstOctet;
        do {
            firstOctet = getRandomOctet();
        } while (isPrivateOrReservedFirstOctet(firstOctet));

        return String.format(
                "%d.%d.%d.%d",
                firstOctet,
                getRandomOctet(),
                getRandomOctet(),
                getRandomOctet()
        );
    }

    private static int getRandomOctet() {
        return ThreadLocalRandom.current().nextInt(0, 256);
    }

    private static boolean isPrivateOrReservedFirstOctet(int firstOctet) {
        return firstOctet == 0
                || firstOctet == 10
                || firstOctet == 127
                || firstOctet == 172
                || firstOctet == 192
                || firstOctet >= 224;
    }
}
