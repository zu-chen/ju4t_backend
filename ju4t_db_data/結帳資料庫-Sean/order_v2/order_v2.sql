-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2021-02-25 16:26:07
-- 伺服器版本： 10.4.16-MariaDB
-- PHP 版本： 7.3.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `ju4t_final`
--

-- --------------------------------------------------------

--
-- 資料表結構 `order_detail`
--

CREATE TABLE `order_detail` (
  `sid` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `model_id` varchar(255) NOT NULL,
  `shell_id` int(11) NOT NULL,
  `series_id` int(11) NOT NULL,
  `design_id` int(11) NOT NULL,
  `per_price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `phoneColor` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `order_detail`
--

INSERT INTO `order_detail` (`sid`, `order_id`, `model_id`, `shell_id`, `series_id`, `design_id`, `per_price`, `quantity`, `phoneColor`) VALUES
(1, 1614235074, 'iPhone 12', 1, 4, 21, 830, 1, 'white'),
(2, 1614235074, 'iPhone 12', 1, 4, 19, 830, 1, 'white'),
(3, 1614235074, 'iPhone 12', 1, 4, 23, 830, 1, 'white'),
(4, 1614235229, 'iPhone 12', 1, 6, 37, 860, 1, 'white'),
(5, 1614235229, 'iPhone 12', 1, 2, 2, 900, 2, 'white'),
(6, 1614236348, 'iPhone 12', 1, 5, 30, 760, 1, 'white'),
(7, 1614236348, 'iPhone 12 Mini', 1, 6, 37, 860, 1, 'white'),
(8, 1614237452, 'iPhone 12 Mini', 1, 4, 25, 830, 1, 'white'),
(9, 1614237452, 'iPhone 12 Mini', 1, 4, 24, 830, 1, 'white'),
(10, 1614237666, 'iPhone XS Max', 2, 2, 4, 900, 1, 'gold'),
(11, 1614237666, 'iPhone 12 Pro', 3, 2, 6, 900, 1, 'silver'),
(12, 1614237666, 'iPhone 12 Pro', 6, 2, 11, 900, 1, 'blue');

-- --------------------------------------------------------

--
-- 資料表結構 `order_list`
--

CREATE TABLE `order_list` (
  `sid` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `discount` float NOT NULL,
  `price` int(11) NOT NULL,
  `payway` varchar(255) NOT NULL,
  `getway` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `store` varchar(255) NOT NULL,
  `taker` varchar(255) NOT NULL,
  `taker_phone` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `status` int(11) NOT NULL,
  `unique_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `order_list`
--

INSERT INTO `order_list` (`sid`, `member_id`, `discount`, `price`, `payway`, `getway`, `address`, `store`, `taker`, `taker_phone`, `created_at`, `status`, `unique_id`) VALUES
(1, 1, 0.7, 1743, '貨到付款', '超商取貨', '台中市南屯區五權西路二段882號', '鑫權勝', '工藤新一', '0911-111-111', '2021-01-28 11:59:04', 2, '1614235074'),
(2, 1, 0.8, 2128, '貨到付款', '黑貓宅配', '大安區復興南路一段390號2樓', '', '毛利蘭', '0912-345-678', '2021-02-26 15:40:29', 1, '1614235229'),
(4, 2, 0.9, 1494, '貨到付款', '超商取貨', '台北市大安區信義路二段198巷6號1樓', '東門', '賈先生', '0922-222-222', '2021-02-02 10:17:32', 2, '1614237452'),
(5, 2, 0.9, 2430, '信用卡', '黑貓宅配', '大安區復興南路一段390號2樓', '', '賈先生', '0922-222-222', '2021-02-27 15:21:06', 1, '1614237666');

-- --------------------------------------------------------

--
-- 資料表結構 `order_status`
--

CREATE TABLE `order_status` (
  `sid` int(11) NOT NULL,
  `status` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `order_status`
--

INSERT INTO `order_status` (`sid`, `status`) VALUES
(1, '未出貨'),
(2, '已出貨'),
(3, '已棄單');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`sid`);

--
-- 資料表索引 `order_list`
--
ALTER TABLE `order_list`
  ADD PRIMARY KEY (`sid`);

--
-- 資料表索引 `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`sid`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_list`
--
ALTER TABLE `order_list`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_status`
--
ALTER TABLE `order_status`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
