// App.js
import React, { useState, useRef, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./App.css"; // فایل CSS تو که استایل‌هاش رو فرستادی

// نوع درگ
const ItemTypes = { MOVE: "move" };

// دسته‌بندی‌ها (مثل فایل قبلی)
const categories = ["همه", "سینه", "پا", "پشت", "جلو بازو", "پشت بازو", "شکم", "سرشانه"];
const DAYS_OF_WEEK = ["روز اول", "روز دوم", "روز سوم", "روز چهارم"];

// ---------- لیست نمونهٔ حرکات (تو می‌تونی لیست کامل خودت رو جایگزین کنی) ----------
const allMoves = [


    ///سینه
    { id: '12', name: 'پرس سینه هالتر + کامل', category: 'سینه' },
    { id: '13', name: 'پرس سینه اسمیت', category: 'سینه' },
    { id: '14', name: 'پرس سینه دمبل تک دست', category: 'سینه' },
    { id: '15', name: 'پرس سینه جفت دمبل دست جمع', category: 'سینه' },
    { id: '16', name: 'پرس سینه دمبل دست برعکس', category: 'سینه' },
    { id: '17', name: 'پرس سینه دمبل موازی', category: 'سینه' },
    { id: '18', name: 'قفسه سینه دستگاه', category: 'سینه' },
    { id: '19', name: 'قفسه سینه دستگاه تک دست', category: 'سینه' },
    { id: '20', name: 'قفسه سینه دستگاه تک دست از بغل', category: 'سینه' },
    { id: '21', name: 'قفسه سینه تک دست ثابت', category: 'سینه' },
    { id: '22', name: 'شنا سطح صاف', category: 'سینه' },
    { id: '23', name: 'کراس اور قفسه سینه ایستاده ', category: 'سینه' },
    { id: '24', name: 'کراس اور قفسه سینه نشسته', category: 'سینه' },
    { id: '25', name: 'کراس اور قفسه سینه خوابیده', category: 'سینه' },
    { id: '26', name: 'کراس اور سینه', category: 'سینه' },
    { id: '27', name: 'پرس بالا سینه هالتر', category: 'سینه' },
    { id: '28', name: 'پرس بالا سینه نیمه+کامل', category: 'سینه' },
    { id: '29', name: 'پرس بالا سینه اسمیت', category: 'سینه' },
    { id: '30', name: 'پرس بالا سینه دمبل', category: 'سینه' },
    { id: '31', name: 'پرس بالا سینه دمبل تک دست', category: 'سینه' },
    { id: '32', name: 'پرس بالا سینه دمبل دست برعکس', category: 'سینه' },
    { id: '33', name: 'پرس بالا سینه دمبل موازی', category: 'سینه' },
    { id: '34', name: 'کراس اور معکوس', category: 'سینه' },
    { id: '35', name: 'بالا سینه جفت دمبل معکوس ایستاده', category: 'سینه' },
    { id: '36', name: 'بالا سینه جفت دمبل معکوس میز شیب دار', category: 'سینه' },
    { id: '37', name: 'شنا سوئدی شیب منفی', category: 'سینه' },
    { id: '38', name: 'کراس اور قفسه بالا سینه ایستاده', category: 'سینه' },
    { id: '39', name: 'کراس اور قفسه بالا سینه نیمکت', category: 'سینه' },
    { id: '40', name: 'پرس بالا سینه جفت دمبل جمع', category: 'سینه' },
    { id: '41', name: 'پرس زیر سینه هالتر', category: 'سینه' },
    { id: '42', name: 'پرس زیرسینه هالتر نیمه+کامل', category: 'سینه' },
    { id: '43', name: 'کراس اور زیرسینه نشسته', category: 'سینه' },
    { id: '44', name: 'کراس اور زیر سینه ایستاده', category: 'سینه' },
    { id: '45', name: 'کراس اور قفسه زیرسینه نیمکت', category: 'سینه' },
    { id: '46', name: 'پل اور خوابیده روی نیمکت', category: 'سینه' },
    { id: '47', name: 'پل اور نشسته روی نیمکت', category: 'سینه' },
    { id: '48', name: 'پارالل زیرسینه', category: 'سینه' },
    { id: '49', name: 'شنا سوئدی شیب مثبت', category: 'سینه' },
    { id: '50', name: 'پرس زیرسینه دمبل', category: 'سینه' },
    { id: '51', name: 'پرس زیرسینه دمبل تک دست', category: 'سینه' },
    { id: '52', name: 'پرس زیرسینه دمبل دست برعکس ', category: 'سینه' },
    { id: '53', name: 'پرس زیرسینه دمبل دست جمع', category: 'سینه' },


    ///جلو بازو
    { id: '54', name: 'جلو بازو هالتر ایستاده', category: 'جلو بازو' },
    { id: '55', name: 'جلو بازو هالتر EZ ایستاده', category: 'جلو بازو' },
    { id: '56', name: 'جلو بازو هالتر دست باز ایستاده', category: 'جلو بازو' },
    { id: '57', name: 'جلو بازو هالتر دست جمع ایستاده', category: 'جلو بازو' },
    { id: '58', name: 'جلو بازو هالتر EZ دست باز ایستاده', category: 'جلو بازو' },
    { id: '59', name: 'جلو بازو هالتر EZ دست جمع ایستاده', category: 'جلو بازو' },
    { id: '60', name: 'جلو بازو هالتر ایستاده نیمه بالا + نیمه پایین', category: 'جلو بازو' },
    { id: '61', name: 'جلو بازو هالتر EZ نیمه پایین', category: 'جلو بازو' },
    { id: '62', name: 'جلو بازو هالتر EZ نیمه بالا', category: 'جلو بازو' },
    { id: '63', name: 'جلو بازو تک دمبل متناوب ایستاده', category: 'جلو بازو' },
    { id: '64', name: 'جلو بازو جفت دمبل نشسته', category: 'جلو بازو' },
    { id: '65', name: 'جلو بازو جفت دمبل چکشی ایستاده', category: 'جلو بازو' },
    { id: '66', name: 'جلو بازو جفت دمبل چکشی نشسته', category: 'جلو بازو' },
    { id: '67', name: 'جلو بازو جفت دمبل روی میز بالاسینه', category: 'جلو بازو' },
    { id: '68', name: 'جلو بازو تک دمبل چکشی روی میز لاری', category: 'جلو بازو' },
    { id: '69', name: 'جلو بازو لاری هالتر', category: 'جلو بازو' },
    { id: '70', name: 'جلو بازو لاری دمبل جفت دست ', category: 'جلو بازو' },
    { id: '71', name: 'جلو بازو لاری دمبل تک دست', category: 'جلو بازو' },
    { id: '72', name: 'جلو بازو سیم کش دست جمع', category: 'جلو بازو' },
    { id: '73', name: 'جلو بازو سیم کش دست باز', category: 'جلو بازو' },
    { id: '74', name: 'جلو بازو سیم کش دست باز + دست جمع', category: 'جلو بازو' },
    { id: '75', name: 'جلو بازو فیگوری دمبل', category: 'جلو بازو' },
    { id: '76', name: 'جلو بازو فیگوری کراس اور', category: 'جلو بازو' },
    { id: '77', name: 'جلو بازو فیگوری تک دست', category: 'جلو بازو' },
    { id: '78', name: 'جلو بازو سیم کش از رو به رو', category: 'جلو بازو' },
    { id: '79', name: 'جلو بازو سیم کش تک دست از رو به رو', category: 'جلو بازو' },
    { id: '80', name: 'جلو بازو عنکبوتی هالتر', category: 'جلو بازو' },
    { id: '81', name: 'جلو بازو عنکبوتی دمبل', category: 'جلو بازو' },
    { id: '82', name: 'جلو بازو هالتر خم', category: 'جلو بازو' },
    { id: '83', name: 'جلو بازو تک دست دمبل خم', category: 'جلو بازو' },
    { id: '84', name: 'جلو بازو دمبل زاتمن ایستاده', category: 'جلو بازو' },
    { id: '85', name: 'جلو بازو سیم کش طناب', category: 'جلو بازو' },
    { id: '86', name: 'جلو بازو دمبل چرخشی', category: 'جلو بازو' },
    { id: '87', name: 'جلو بازو دمبل مکس تناوبی', category: 'جلو بازو' },
    { id: '88', name: 'جلو بازو سیم کش جفت دست از پایین', category: 'جلو بازو' },
    { id: '89', name: 'جلو بازو پمپی تک دست', category: 'جلو بازو' },
    { id: '90', name: 'جلو بازو پمپی جفت دست', category: 'جلو بازو' },
    { id: '91', name: 'جلو بازو دمبل گرد', category: 'جلو بازو' },
    { id: '92', name: 'جلو بازو سیم کش پمپ تک دست', category: 'جلو بازو' },
    { id: '93', name: 'جلو بازو سیم کش پمپ جفت دست', category: 'جلو بازو' },
    { id: '94', name: 'ساعد دستگاه', category: 'جلو بازو' },
    { id: '95', name: 'روی ساعد دستگاه', category: 'جلو بازو' },
    { id: '96', name: 'روی ساعد هالتر', category: 'جلو بازو' },
    { id: '97', name: 'روی ساعد هالتر EZ', category: 'جلو بازو' },
    { id: '98', name: 'ساعد هالتر روی میز', category: 'جلو بازو' },
    { id: '99', name: 'روی ساعد دمبل تک دست', category: 'جلو بازو' },
    { id: '100', name: 'روی ساعد دمبل جفت دست', category: 'جلو بازو' },
    { id: '101', name: 'ساعد دمبل از پشت', category: 'جلو بازو' },
    { id: '102', name: 'ساعد هالتر از پشت', category: 'جلو بازو' },
    { id: '103', name: 'ساعد دمبل چکشی نشسته', category: 'جلو بازو' },
    { id: '104', name: 'جلو بازو هالتر EZ نیمه + کامل', category: 'جلو بازو' },
    { id: '105', name: 'جلو بازو دمبل نیمه + کامل (تک دست متناوب)', category: 'جلو بازو' },
    { id: '106', name: 'جلو بازو جفت دمبل ایستاده', category: 'جلو بازو' },
    


    ///سرشانه
    { id: '108', name: 'سرشانه هالتر از جلو', category: 'سرشانه' },
    { id: '109', name: 'سرشانه هالتر از جلو دست برعکس', category: 'سرشانه' },
    { id: '110', name: 'پرس سرشانه جفت دمبل دست جمع ', category: 'سرشانه' },
    { id: '111', name: 'سرشانه جفت دمبل از جلو دست موازی', category: 'سرشانه' },
    { id: '112', name: 'سرشانه هالتر EZ از جلو', category: 'سرشانه' },
    { id: '113', name: 'نشر از جلو سیم کش', category: 'سرشانه' },
    { id: '114', name: 'نشر از جلو هالتر', category: 'سرشانه' },
    { id: '115', name: 'نشر از جلو جفت دمبل', category: 'سرشانه' },
    { id: '116', name: 'نشر از جلو دمبل تک تک', category: 'سرشانه' },
    { id: '117', name: 'نشر از جلو دمبل روی میز شیب دار', category: 'سرشانه' },
    { id: '118', name: 'نشر از جلو دمبل نشسته', category: 'سرشانه' },
    { id: '119', name: 'نشر از جلو سیم کش تک تک', category: 'سرشانه' },
    { id: '120', name: 'نشر خم دمبل', category: 'سرشانه' },
    { id: '121', name: 'نشر خم دمبل روی میز شیب دار', category: 'سرشانه' },
    { id: '122', name: 'نشر خم دمبل نشسته', category: 'سرشانه' },
    { id: '123', name: 'نشر خم هالتر', category: 'سرشانه' },
    { id: '124', name: 'عکس قفسه دستگاه', category: 'سرشانه' },
    { id: '125', name: 'عکس قفسه دستگاه تک دست', category: 'سرشانه' },
    { id: '126', name: 'عکس قفسه دستگاه تک دست از بغل', category: 'سرشانه' },
    { id: '127', name: 'فیس پول خوابیده', category: 'سرشانه' },
    { id: '128', name: 'فیس پول نشسته', category: 'سرشانه' },
    { id: '129', name: 'فیس پول ایستاده', category: 'سرشانه' },
    { id: '130', name: 'نشر از جانب سیم کش تک تک', category: 'سرشانه' },
    { id: '131', name: 'کول لیفت هالتر از پشت', category: 'سرشانه' },
    { id: '132', name: 'کول لیفت سیم کش از پشت', category: 'سرشانه' },
    { id: '133', name: 'سرشانه سیم کش ضربدری جفت دست', category: 'سرشانه' },
    { id: '134', name: 'سرشانه سیم کش ضربدری تک دست', category: 'سرشانه' },
    { id: '135', name: 'نشر خم سیم کش', category: 'سرشانه' },
    { id: '136', name: 'پرس شانه دمبل', category: 'سرشانه' },
    { id: '137', name: 'پرس شانه دمبل موازی', category: 'سرشانه' },
    { id: '138', name: 'صلیب دمبل', category: 'سرشانه' },
    { id: '139', name: 'صلیب کراس اور', category: 'سرشانه' },
    { id: '140', name: 'صلیب کراس اور از بالا', category: 'سرشانه' },
    { id: '141', name: 'کول لیفت هالتر', category: 'سرشانه' },
    { id: '142', name: 'کول لیفت دمبل', category: 'سرشانه' },
    { id: '143', name: 'کول لیفت سیم کش', category: 'سرشانه' },
    { id: '144', name: 'نشر از جانب سیم کش تک', category: 'سرشانه' },


    ///پا
    { id: '145', name: 'جلو پا', category: 'پا' },
    { id: '146', name:'جلو پا پا باز', category: 'پا' },
    { id: '147', name: 'جلو پا پا جمع', category: 'پا' },
    { id: '148', name: 'جلو پا نیمه + کامل', category: 'پا' },
    { id: '149', name: 'جلو پا با مکث 3 ثانیه', category: 'پا' },
    { id: '150', name: 'جلو پا تمرکزی', category: 'پا' },
    { id: '151', name: 'پرس پا', category: 'پا' },
    { id: '152', name: 'پرس پا پا باز', category: 'پا' },
    { id: '153', name: 'پرس پا پا جمع', category: 'پا' },
    { id: '154', name: 'پرس پا نیمه', category: 'پا' },
    { id: '155', name: 'پرس پا پا بالای صفحه', category: 'پا' },
    { id: '156', name: 'پرس پا پا پایین صفحه', category: 'پا' },
    { id: '157', name: 'هاگ پا', category: 'پا' },
    { id: '158', name: 'هاگ پا پا باز', category: 'پا' },
    { id: '159', name: 'هاگ پا پا جمع', category: 'پا' },
    { id: '160', name: 'هاگ پا پا بالای صفحه', category: 'پا' },
    { id: '161', name: 'هاگ پا پا پایین صفحه', category: 'پا' },
    { id: '162', name: 'هاگ پا نیمه', category: 'پا' },
    { id: '163', name: 'اسکات هالتر', category: 'پا' },
    { id: '164', name: 'اسکات هالتر نیمه', category: 'پا' },
    { id: '165', name: 'اسکات هالتر پا باز', category: 'پا' },
    { id: '166', name: 'اسکات هالتر پا جمع', category: 'پا' },
    { id: '167', name: 'اسکات اسمیت', category: 'پا' },
    { id: '168', name: 'اسکات اسمیت نیمه', category: 'پا' },
    { id: '169', name: 'اسکات اسمیت پا باز', category: 'پا' },
    { id: '170', name: 'اسکات اسمیت پا جمع', category: 'پا' },
    { id: '171', name: 'اسکات هالتر از جلو', category: 'پا' },
    { id: '172', name: 'اسکات اسمیت از جلو', category: 'پا' },
    { id: '173', name: 'لانگز دمبل', category: 'پا' },
    { id: '174', name: 'لانگز هالتر', category: 'پا' },
    { id: '175', name: 'لانگز دمبل تک دست', category: 'پا' },
    { id: '176', name: 'لانگز بلغاری', category: 'پا' },
    { id: '177', name: 'لانگز بلغاری تک دست', category: 'پا' },
    { id: '178', name: 'هاگ دمبل بین پا', category: 'پا' },
    { id: '179', name: 'ددلیفت هالتر', category: 'پا' },
    { id: '180', name: 'ددلیفت دمبل', category: 'پا' },
    { id: '181', name: 'ددلیفت رومانیایی هالتر', category: 'پا' },
    { id: '182', name: 'ددلیفت رومانیایی دمبل', category: 'پا' },
    { id: '183', name: 'ساق پا ایستاده', category: 'پا' },
    { id: '184', name: 'ساق پا با دستگاه پرس', category: 'پا' },
    { id: '185', name: 'اسکات از جلو سیم کش', category: 'پا' },
    { id: '186', name: 'هیپ تراست', category: 'پا' },
    { id: '187', name: 'اسکات دمبل', category: 'پا' },
    { id: '188', name: 'پشت پا دمبل خوابیده', category: 'پا' },
    { id: '189', name: 'پشت پا دستگاه', category: 'پا' },
    { id: '190', name: 'پشت پا ایستاده تک تک', category: 'پا' },

    ///زیربغل
    { id: '191', name: 'لت دست باز از جلو', category: 'پشت' },
    { id: '192', name: 'لت پشت گردن', category: 'پشت' },
    { id: '193', name: 'لت دوبل از بالا', category: 'پشت' },
    { id: '194', name: 'قایقی دست موازی', category: 'پشت' },
    { id: '195', name: 'قایقی', category: 'پشت' },
    { id: '196', name: 'لت دست باز از جلو دست موازی', category: 'پشت' },
    { id: '197', name: 'لت دوبل از بالا نشسته', category: 'پشت' },
    { id: '198', name: 'لت دوبل از بالا روی میز شیب دار', category: 'پشت' },
    { id: '199', name: 'زیربغل سیم کش ایستاده دست صاف جمع', category: 'پشت' },
    { id: '200', name: 'زیربغل سیم کش ایستاده طناب', category: 'پشت' },
    { id: '201', name: 'زیربغل دستگاه H', category: 'پشت' },
    { id: '202', name: 'زیربغل دستگاه H موازی', category: 'پشت' },
    { id: '203', name: 'زیربغل دستگاه H تک دست', category: 'پشت' },
    { id: '204', name: 'تی بار دستگاه', category: 'پشت' },
    { id: '205', name: 'تی باز هالتر', category: 'پشت' },
    { id: '206', name: 'تی بار دستگاه دست باز', category: 'پشت' },
    { id: '207', name: 'تی بار دستگاه دست جمع', category: 'پشت' },
    { id: '208', name: 'تی باز دستگاه دست باز برعکس', category: 'پشت' },
    { id: '209', name: 'زیربغل هالتر خم', category: 'پشت' },
    { id: '210', name: 'زیربغل هالتر خم دست جمع برعکس', category: 'پشت' },
    { id: '211', name: 'زیربغل جفت دمبل خم', category: 'پشت' },
    { id: '212', name: 'زیربغل جفت دمبل خم نشسته', category: 'پشت' },
    { id: '213', name: 'زیربغل جفت دمبل خم روی میز شیب دار', category: 'پشت' },
    { id: '214', name: 'زیربغل سیم کش خم', category: 'پشت' },
    { id: '215', name: 'زیربغل سیم کش تک خم', category: 'پشت' },
    { id: '216', name: 'زیربغل تک دمبل خم', category: 'پشت' },
    { id: '217', name: 'زیر بغل سیم کش تک دست با دستگاه ', category: 'پشت' },
    { id: '218', name: 'بارفیکس دست باز', category: 'پشت' },
    { id: '219', name: 'بارفیکس دست جمع', category: 'پشت' },
    { id: '220', name: 'بارفیکس دست برعکس', category: 'پشت' },

    ///پشت بازو
    { id: '221', name: 'پشت بازو هالتر خوابیده', category: 'پشت بازو' },
    { id: '222', name: 'پشت بازو هالتر خوابیده دست برعکس', category: 'پشت بازو' },
    { id: '223', name: 'پشت بازو هالتر نشسته', category: 'پشت بازو' },
    { id: '224', name: 'پشت بازو هالتر روی میز شیب دار', category: 'پشت بازو' },
    { id: '225', name: 'پشت بازو هالتر روی میز زیرسینه', category: 'پشت بازو' },
    { id: '226', name: 'پشت بازو جفت دمبل نشسته', category: 'پشت بازو' },
    { id: '227', name: 'پشت بازو جفت دمبل خوابیده', category: 'پشت بازو' },
    { id: '228', name: 'پشت بازو جفت دمبل روی میز شیب دار', category: 'پشت بازو' },
    { id: '229', name: 'پشت بازو سیم کش', category: 'پشت بازو' },
    { id: '230', name: 'پشت بازو سیم کش دست برعکس', category: 'پشت بازو' },
    { id: '231', name: 'پشت بازو سیم کش طناب', category: 'پشت بازو' },
    { id: '232', name: 'پشت بازو سیم کش با دسته V', category: 'پشت بازو' },
    { id: '233', name: 'پشت بازو سیم کش خم', category: 'پشت بازو' },
    { id: '234', name: 'پشت بازو سیم کش طناب خم', category: 'پشت بازو' },
    { id: '235', name: 'پشت بازو سیم کش تک دست خم', category: 'پشت بازو' },
    { id: '236', name: 'پشت بازو سیم کش تک دست', category: 'پشت بازو' },
    { id: '237', name: 'پشت بازو سیم کش ', category: 'پشت بازو' },
    { id: '238', name: 'پشت بازو سیم کش تک دست برعکس', category: 'پشت بازو' },
    { id: '239', name: 'پشت بازو تک دمبل جفت دست ', category: 'پشت بازو' },
    { id: '240', name: 'پشت بازو پرسی هالتر دست جمع', category: 'پشت بازو' },
    { id: '241', name: 'پشت بازو دیپ', category: 'پشت بازو' },
    { id: '242', name: 'پشت بازو کیک بک جفت دمبل', category: 'پشت بازو' },
    { id: '243', name: 'پشت بازو کیک بک تک دمبل', category: 'پشت بازو' },
    { id: '244', name: 'پشت بازو کیک بک سیم کش', category: 'پشت بازو' },
    { id: '245', name: 'پشت بازو تک دست مایل خوابیده', category: 'پشت بازو' },
    { id: '246', name: 'پشت بازو مایل تک دست نشسته', category: 'پشت بازو' },
    { id: '247', name: 'پشت بازو جفت دمبل پرسی مایل', category: 'پشت بازو' },
    { id: '248', name: 'شنا الماسی (دست جمع)', category: 'پشت بازو' },
    { id: '249', name: 'پارالل', category: 'پشت بازو' },
    

    ///شکم
    { id: '250', name: 'زیرشکم روی میز شیب دار', category: 'شکم' },
    { id: '251', name: 'زیرشکم روی میز تخت', category: 'شکم' },
    { id: '252', name: 'زیرشکم روی زمین', category: 'شکم' },
    { id: '253', name: 'زیرشکم خلبانی پا جمع', category: 'شکم' },
    { id: '254', name: 'زیرشکم خلبانی پا صاف', category: 'شکم' },
    { id: '255', name: 'زیرشکم قیچی', category: 'شکم' },
    { id: '256', name: 'پلانک پهلو', category: 'شکم' },
    { id: '257', name: 'پلانک شکم', category: 'شکم' },
    { id: '258', name: 'کرانچ معکوس روی زمین', category: 'شکم' },
    { id: '259', name: 'شکم دوچرخه', category: 'شکم' },
    { id: '260', name: 'تویست روسی', category: 'شکم' },
    { id: '261', name: 'کرانچ سیم کش ایستاده', category: 'شکم' },
    { id: '262', name: 'کرانچ سیم کش نشسته', category: 'شکم' },
    { id: '263', name: 'شکم کوهنوردی', category: 'شکم' },
    { id: '264', name: 'شکم کوهنوردی چرخشی', category: 'شکم' },
    { id: '265', name: 'کرانچ پهلو', category: 'شکم' },
    { id: '266', name: 'کرانچ چرخشی', category: 'شکم' },
    { id: '267', name: 'هیل تاچ', category: 'شکم' },
    { id: '268', name: 'شکم رو میز تخت', category: 'شکم' },
    { id: '269', name: 'شکم روی میز شیب دار', category: 'شکم' },
    { id: '270', name: 'شکم نیمه روی میز تخت', category: 'شکم' },
    { id: '271', name: 'شکم نیمه روی میز شیب دار', category: 'شکم' },
   
];


// ---------- کامپوننت MoveItem (قابل درگ و قابل انتخاب برای سوپرست) ----------
const MoveItem = ({ move, selectable, selected, onSelect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MOVE,
    item: { id: move.id, name: move.name, category: move.category },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className={`move-item ${selectable ? "selectable" : ""} ${selected ? "selected" : ""}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 8,
        marginBottom: 6,
      }}
      onClick={() => selectable && onSelect && onSelect(move)}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {selectable && (
          <input
            type="checkbox"
            checked={!!selected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(move);
            }}
            title="انتخاب برای سوپرست"
          />
        )}
        <div>
          <div style={{ fontWeight: 700 }}>💪 {move.name}</div>
          <div className="move-category">{move.category}</div>
        </div>
      </div>
    </div>
  );
};

// ---------- کامپوننت DayDropTarget (هر روز جدول) ----------
const DayDropTarget = ({ day, moves, onDropMove, onRemoveItem, onUpdateMoveValues }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.MOVE,
    drop: (item) => onDropMove(item, day),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={drop}
      className={`day-drop-target ${isOver ? "is-over" : ""} ${!isExpanded ? "collapsed" : ""}`}
      style={{ width: "100%" }}
    >
      <div className="day-header">
        <h4 className="day-title">{day}</h4>
        <button
          className="collapse-btn"
          onClick={() => setIsExpanded((p) => !p)}
          title={isExpanded ? "بستن" : "باز کردن"}
        >
          {isExpanded ? "− بستن" : "+ باز کردن"}
        </button>
      </div>

      {isExpanded ? (
        <>
          {moves.length === 0 ? (
            <p className="day-placeholder">حرکت را اینجا رها کنید</p>
          ) : (
            <div className="day-moves-container">
              {moves.map((item, index) => {
                if (item.type === "single") {
                  return (
                    <div key={item.instanceId} className="selected-move-item">
                      <span className="order-number">{index + 1}.</span>

                      <div className="move-details">
                        <div style={{ flex: 1 }}>
                          <div className="move-name-print">
                            <strong>{item.move.name}</strong>
                          </div>
                        </div>

                        <div className="move-props-container">
                          <label style={{ marginLeft: 8 }}>
                            ست:
                            <input
                              type="number"
                              min="0"
                              value={item.sets ?? ""}
                              onChange={(e) =>
                                onUpdateMoveValues(day, item.instanceId, {
                                  sets: e.target.value === "" ? "" : parseInt(e.target.value),
                                })
                              }
                              style={{width: 60,
                                    marginRight: 6,
                                    backgroundColor: "#f0f0f0",
                                    color: "#555",
                                    border: "1px solid #e0e0e0",
                                    padding: "8px 14px",
                                    borderRadius: 20,
                                    cursor: "pointer",
                                    fontSize: "1.2em",
                                    fontWeight: 500,
                                    height:25,
                                    transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                                    fontFamily:'YekanBakh',
                                    flexGrow: 0,
                                    flexShrink: 0,}}
                            />
                          </label>
                          <label>
                            تکرار:
                            <input
                              type="number"
                              min="0"
                              value={item.reps ?? ""}
                              onChange={(e) =>
                                onUpdateMoveValues(day, item.instanceId, {
                                  reps: e.target.value === "" ? "" : parseInt(e.target.value),
                                })
                              }
                              style={{
                                    width: 60,
                                    marginRight: 6,
                                    backgroundColor: "#f0f0f0",
                                    color: "#555",
                                    border: "1px solid #e0e0e0",
                                    padding: "8px 14px",
                                    borderRadius: 20,
                                    cursor: "pointer",
                                    fontSize: "1.2em",
                                    fontWeight: 500,
                                    height:25,
                                    transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                                    flexGrow: 0,
                                    fontFamily:'YekanBakh',
                                    flexShrink: 0,}}
                            />
                          </label>
                        </div>
                      </div>

                      <button className="remove-btn" onClick={() => onRemoveItem(day, item.instanceId)}>
                        ✖
                      </button>
                    </div>
                  );
                } else if (item.type === "superset") {
                  // سوپرست: نمایش هر حرکت داخل کارت سوپرست
                  return (
                    <div key={item.instanceId} className="selected-move-item" style={{ flexDirection: "column", alignItems: "stretch", borderRight: "5px solid #00a8a8" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <strong>🔥 سوپرست</strong>
                        <button className="remove-btn" onClick={() => onRemoveItem(day, item.instanceId)}>
                          ✖
                        </button>
                      </div>

                      <div className="day-moves-container" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {item.moves.map((mv, idx) => (
                          <div key={mv.instanceId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span style={{ fontWeight: 700 }}>{idx + 1}. {mv.name}</span>
                            </div>

                            <div className="move-props-container">
                              <label style={{ marginLeft: 8 }}>
                                ست:
                                <input
                                    type="number"
                                    min="0"
                                    value={mv.sets ?? ""}
                                    onChange={(e) =>
                                        onUpdateMoveValues(day, item.instanceId, {
                                        supersetMoveInstanceId: mv.instanceId,
                                        sets: e.target.value === "" ? "" : parseInt(e.target.value),
                                        })
                                    }
                                    className="styled-input-number"
                            />

                              </label>
                              <label>
                                تکرار:
                                <input
                                    type="number"
                                    min="0"
                                    value={mv.reps ?? ""}
                                    onChange={(e) =>
                                        onUpdateMoveValues(day, item.instanceId, {
                                        supersetMoveInstanceId: mv.instanceId,
                                        reps: e.target.value === "" ? "" : parseInt(e.target.value),
                                        })
                                    }
                                    className="styled-input-number"
                                />

                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else return null;
              })}
            </div>
          )}
        </>
      ) : (
        <p className="collapsed-summary">{moves.length} حرکت اضافه شده</p>
      )}
    </div>
  );
};

// ---------- PDF Generator (از schedule رندر می‌گیرد) ----------
const PDFGenerator = ({ targetRef }) => {
  const generatePdf = async () => {
    if (!targetRef.current) {
      console.error("Target for PDF not found");
      return;
    }

    // html2canvas options: scale برای بالانس کیفیت/حجم
    const canvas = await html2canvas(targetRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowHeight: targetRef.current.scrollHeight + 100,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = (imgHeight - heightLeft) * -1;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("برنامه-تمرینی.pdf");
  };

  return (
    <button className="pdf-button" onClick={generatePdf}>
      خروجی PDF جدول هفتگی (بزرگ و خوانا)
    </button>
  );
};

// ---------- کامپوننت اصلی App ----------
export default function App() {
  const canvasRef = useRef(null);

  // مقداردهی اولیهٔ جدول تمرینی
  const [workoutSchedule, setWorkoutSchedule] = useState(() => {
    const init = {};
    DAYS_OF_WEEK.forEach((d) => (init[d] = []));
    return init;
  });

  // فیلترینگ و انتخاب برای سوپرست
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForSuperset, setSelectedForSuperset] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newMoveName, setNewMoveName] = useState("");
  const [newMoveCategory, setNewMoveCategory] = useState(categories[1]);

  const MOVES_PER_PAGE = 6;


  // helper: instanceId یکتا
  const makeInstanceId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  // فیلتر حرکات
  const filteredMoves = useMemo(() => {
    return allMoves.filter(
      (m) =>
        (selectedCategory === "همه" || m.category === selectedCategory) &&
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedCategory, searchQuery]);
    const totalPages = Math.ceil(filteredMoves.length / MOVES_PER_PAGE);

    const paginatedMoves = useMemo(() => {
    const start = (currentPage - 1) * MOVES_PER_PAGE;
    const end = start + MOVES_PER_PAGE;
    return filteredMoves.slice(start, end);
    }, [filteredMoves, currentPage]);


  // افزودن حرکت تکی به روز (در هنگام دراپ)
  const addMoveToDay = (moveItem, day) => {
    const single = {
      type: "single",
      instanceId: makeInstanceId(),
      move: { id: moveItem.id, name: moveItem.name, category: moveItem.category },
      sets: "",
      reps: "",
    };
    setWorkoutSchedule((prev) => ({ ...prev, [day]: [...prev[day], single] }));
  };

  // تابع عمومی دراپ
  const handleDropMove = (item, day) => {
    addMoveToDay(item, day);
  };

  // افزودن سوپرست به روز (از انتخاب‌های سایدبار)
  const addSupersetToDay = (day) => {
    if (selectedForSuperset.length < 2) {
      alert("برای ساخت سوپرست حداقل دو حرکت انتخاب کنید.");
      return;
    }
    const movesInSuperset = selectedForSuperset.map((m) => ({
      instanceId: makeInstanceId(),
      id: m.id,
      name: m.name,
      category: m.category,
      sets: "",
      reps: "",
    }));
    const superset = {
      type: "superset",
      instanceId: makeInstanceId(),
      moves: movesInSuperset,
    };
    setWorkoutSchedule((prev) => ({ ...prev, [day]: [...prev[day], superset] }));
    setSelectedForSuperset([]);
  };

  // اضافه کردن حرکات یک گروه عضلانی مشخص به روز
  const addCategoryToDay = (day, categoryName) => {
    const movesToAdd = allMoves
      .filter((m) => m.category === categoryName)
      .map((m) => ({
        type: "single",
        instanceId: makeInstanceId(),
        move: { id: m.id, name: m.name, category: m.category },
        sets: "",
        reps: "",
      }));

    setWorkoutSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], ...movesToAdd],
    }));
  };


  // حذف آیتم (single یا superset)
  const removeItemFromDay = (day, instanceId) => {
    setWorkoutSchedule((prev) => ({ ...prev, [day]: prev[day].filter((it) => it.instanceId !== instanceId) }));
  };

  // به‌روزرسانی sets/reps
  /**
   * اگر item.type === 'single' -> instanceId = single.instanceId
   * اگر item.type === 'superset'  -> instanceId = superset.instanceId و payload.supersetMoveInstanceId مشخص می‌شود
   */
  const updateMoveValues = (day, instanceId, payload) => {
    setWorkoutSchedule((prev) => {
      const copy = { ...prev };
      copy[day] = copy[day].map((item) => {
        if (item.instanceId !== instanceId) return item;

        if (item.type === "single") {
          return {
            ...item,
            sets: payload.sets !== undefined ? payload.sets : item.sets,
            reps: payload.reps !== undefined ? payload.reps : item.reps,
          };
        } else if (item.type === "superset") {
          const updatedMoves = item.moves.map((mv) => {
            if (mv.instanceId !== payload.supersetMoveInstanceId) return mv;
            return {
              ...mv,
              sets: payload.sets !== undefined ? payload.sets : mv.sets,
              reps: payload.reps !== undefined ? payload.reps : mv.reps,
            };
          });
          return { ...item, moves: updatedMoves };
        }

        return item;
      });
      return copy;
    });
  };

  // انتخاب/حذف انتخاب برای سوپرست در سایدبار
  const toggleSelectForSuperset = (move) => {
    setSelectedForSuperset((prev) => {
      const exists = prev.find((p) => p.id === move.id);
      if (exists) return prev.filter((p) => p.id !== move.id);
      return [...prev, move];
    });
  };

  // پاک کردن کل برنامه
  const clearProgram = () => {
    const init = {};
    DAYS_OF_WEEK.forEach((d) => (init[d] = []));
    setWorkoutSchedule(init);
  };

  // کپی JSON برنامه به کلیپ‌بورد
  const copyJSON = () => {
    navigator.clipboard?.writeText(JSON.stringify(workoutSchedule, null, 2));
    alert("JSON برنامه کپی شد.");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <h1>برنامه ساز ورزشی هفتگی</h1>

        <div className="main-layout">
          {/* سایدبار */}
          <div className="sidebar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="جستجوی حرکت..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`tab-button ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div  style={{ marginTop: 8, marginBottom: 8 }}>
              <small>انتخاب برای ساخت سوپرست: <strong>{selectedForSuperset.length}</strong></small>
              <div  style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button className="app-button"
                  onClick={() => {
                    setSelectedForSuperset([]);
                    alert("انتخاب‌های سوپرست پاک شد.");
                  }}
                >
                  پاک کردن انتخاب سوپرست
                </button>
              </div>
            </div>
            

            


            <div style={{ maxHeight: 420, overflowY: "auto", paddingRight: 6 }}>
              {filteredMoves.map((m) => (
                <MoveItem
                  key={m.id}
                  move={m}
                  selectable={true}
                  selected={!!selectedForSuperset.find((s) => s.id === m.id)}
                  onSelect={toggleSelectForSuperset}
                />
              ))}
            </div>
            
            <br />
            

            <div className="supersetroz">
              <label style={{ display: "block", marginBottom: 6 }}>
                افزودن سوپرست به:
                <select id="superset-day-select" className="app-select" style={{ marginRight: 8 }}>
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <button className="app-button"
                  onClick={() => {
                    const sel = document.getElementById("superset-day-select").value;
                    addSupersetToDay(sel);
                  }}
                >
                  ➕ افزودن سوپرست
                </button>
                <button className="app-button" onClick={clearProgram}>پاک کردن برنامه</button>
              </div>
              <br />
            <div className="add-move-form" style={{ width: 250,
                                                    height:230,
                                                    padding: 15,
                                                    flexShrink: 0,
                                                    borderRadius: 12,
                                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                                    backdropFilter: "blur(10px)",
                                                    WebkitBackdropFilter: "blur(10px)",
                                                    border: "1px solid rgba(255, 255, 255, 0.3)",
                                                    boxShadow: "0 8px 32px 0 rgba(160, 160, 160, 0.5)",
                                                    marginBottom: 20, }}>
              <h4>➕ افزودن حرکت جدید</h4>
              <input
                type="text"
                placeholder="نام حرکت"
                value={newMoveName}
                onChange={(e) => setNewMoveName(e.target.value)}
                style={{ width: "80%", marginBottom: 6, padding: 6, width: "100%",
                                                                    height:'15%',
                                                                    padding: "12px 18px",
                                                                    border: "1px solid #d0d0d0",
                                                                    borderRadius: 10,
                                                                    fontSize: "1em",
                                                                    boxSizing: "border-box",
                                                                    textAlign: "right",
                                                                    color: "#333",
                                                                    fontFamily: "'YekanBakh', Tahoma, sans-serif",
                                                                    transition: "border-color 0.3s, box-shadow 0.3s",
                                                                    marginBottom: 6, }}
              />
              <select
                value={newMoveCategory}
                onChange={(e) => setNewMoveCategory(e.target.value)}
                style={{ width: "100%", marginBottom: 6, padding: 6, width: "80%", marginBottom: 6, padding: 6, width: "100%",height:'20%',
                                                                    padding: "12px 18px",
                                                                    border: "1px solid #d0d0d0",
                                                                    borderRadius: 10,
                                                                    fontSize: "1em",
                                                                    boxSizing: "border-box",
                                                                    textAlign: "right",
                                                                    color: "#333",
                                                                    fontFamily: "'YekanBakh', Tahoma, sans-serif",
                                                                    transition: "border-color 0.3s, box-shadow 0.3s",
                                                                    marginBottom: 6,  }}
              >
                {categories.filter(c => c !== "همه").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                className="app-button"
                style={{ width: "100%" }}
                onClick={() => {
                  if (!newMoveName.trim()) return alert("نام حرکت نمی‌تواند خالی باشد!");
                  
                  const newMove = {
                    id: Date.now().toString(),
                    name: newMoveName,
                    category: newMoveCategory,
                  };
                  allMoves.push(newMove);
                  setNewMoveName("");
                  setNewMoveCategory(categories[1]);
                  alert("حرکت جدید اضافه شد!");
                }}
              >
                افزودن حرکت
              </button>
            </div>
            </div>
          </div>

          {/* ناحیهٔ جدول تمرینی */}
          <div className="canvas-area">
            <h2> جدول زمان‌بندی هفتگی</h2>

            <div className="schedule-grid-container" ref={canvasRef}>
              <div className="schedule-grid">
                {DAYS_OF_WEEK.map((day) => (
                  <DayDropTarget
                    key={day}
                    day={day}
                    moves={workoutSchedule[day]}
                    onDropMove={handleDropMove}
                    onRemoveItem={removeItemFromDay}
                    onUpdateMoveValues={updateMoveValues}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <PDFGenerator targetRef={canvasRef} />
            
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

