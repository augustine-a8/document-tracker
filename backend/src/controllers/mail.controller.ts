import { v4 as uuidv4 } from "uuid";
import { Response, Request } from "express";

import { Driver, Mail, MailLog } from "../entities";
import { AppDataSource } from "../data-source";
import { Between, ILike } from "typeorm";

// mails go from departments

const MailRepository = AppDataSource.getRepository(Mail);
const MailLogRepository = AppDataSource.getRepository(MailLog);
const DriverRepository = AppDataSource.getRepository(Driver);

async function addNewMail(req: Request, res: Response) {
  const { referenceNumber, addressee } = req.body;

  const mail = new Mail();
  mail.mailId = uuidv4();
  mail.addressee = addressee;
  mail.referenceNumber = referenceNumber;
  mail.date = new Date();
  mail.status = "pending";
  const savedMail = await MailRepository.save(mail);

  const mailLog = new MailLog();
  mailLog.mailLogId = uuidv4();
  mailLog.updatedAt = new Date();
  mailLog.mailId = savedMail.mailId;
  await MailLogRepository.save(mailLog);

  res.status(200).json({
    message: "New mail added",
    mail: savedMail,
  });
}

async function getAllMails(req: Request, res: Response) {
  const allMails = await MailRepository.find({
    relations: {
      driver: true,
    },
  });

  res.status(200).json({
    message: "All mails retrieved",
    allMails,
  });
}

async function getAllPendingMails(req: Request, res: Response) {
  const { start = 1, limit = 10, search = "", date } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(`${date}T23:59:59.999Z`);

  const [allPendingMails, total] = await MailRepository.findAndCount({
    where: [
      {
        status: "pending",
        referenceNumber: ILike(`%${search}%`),
        date: Between(new Date(startDate), new Date(endDate)),
      },
      {
        status: "pending",
        addressee: ILike(`%${search}%`),
        date: Between(new Date(startDate), new Date(endDate)),
      },
    ],
    relations: {
      driver: true,
    },
    skip: startNumber - 1,
    take: pageSize,
  });

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "All pending mails retrieved",
    allPendingMails,
    meta: {
      start,
      end,
      total,
    },
  });
}

async function getAllTransitMails(req: Request, res: Response) {
  const { start = 1, limit = 10, search = "", date } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(`${date}T23:59:59.999Z`);

  const [allTransitMails, total] = await MailRepository.findAndCount({
    where: [
      {
        status: "transit",
        referenceNumber: ILike(`%${search}%`),
        date: Between(new Date(startDate), new Date(endDate)),
      },
      {
        status: "transit",
        addressee: ILike(`%${search}%`),
        date: Between(new Date(startDate), new Date(endDate)),
      },
    ],
    relations: {
      driver: true,
    },
    skip: startNumber - 1,
    take: pageSize,
  });

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "All pending mails retrieved",
    allTransitMails,
    meta: {
      start,
      end,
      total,
    },
  });
}

async function getAllDeliveredMails(req: Request, res: Response) {
  const { start = 1, limit = 10, search = "", date } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(`${date}T23:59:59.999Z`);

  const [allDeliveredMails, total] = await MailRepository.findAndCount({
    where: [
      {
        status: "delivered",
        referenceNumber: ILike(`%${search}%`),
        date: Between(new Date(startDate), new Date(endDate)),
      },
      {
        status: "delivered",
        addressee: ILike(`%${search}%`),
        date: Between(new Date(startDate), new Date(endDate)),
      },
    ],
    relations: {
      driver: true,
    },
    skip: startNumber - 1,
    take: pageSize,
  });

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "All delivered mails retrieved",
    allDeliveredMails,
    meta: {
      start,
      end,
      total,
    },
  });
}

async function getMailById(req: Request, res: Response) {
  const { id: mailId } = req.params;
  const mail = await MailRepository.findOne({
    where: { mailId },
    relations: {
      driver: true,
    },
  });

  if (!mail) {
    res.status(404).json({
      message: "No mail with id provided",
    });
    return;
  }

  const mailLogs = await MailLogRepository.find({ where: { mailId } });

  res.status(200).json({
    message: "Retrieved mail",
    mail: {
      ...mail,
      mailLogs,
    },
  });
}

async function dispatchMail(req: Request, res: Response) {
  const { id: driverId } = req.params;
  const { mailIds } = req.body;

  const driver = await DriverRepository.findOne({ where: { driverId } });
  if (!driver) {
    res.status(404).json({
      message: "No driver with id provided",
    });
    return;
  }

  const updatePromises = mailIds.map(async (mailId: string) => {
    const mail = await MailRepository.findOne({ where: { mailId } });
    if (!mail) {
      res.status(404).json({
        message: "No mail with id provided",
      });
      return;
    }

    await MailRepository.update({ mailId }, { driverId, status: "transit" });

    const mailLog = new MailLog();
    mailLog.mailLogId = uuidv4();
    mailLog.mailId = mailId;
    mailLog.status = "transit";
    mailLog.updatedAt = new Date();
    await MailLogRepository.save(mailLog);
    return mailId;
  });

  const promises = await Promise.all(updatePromises);
  const successfulDispatches = promises.filter((item) => item);

  res.status(200).json({
    message: "Dispatched mails",
    successfulDispatches,
  });
}

async function receiveMail(req: Request, res: Response) {
  const { id: mailId } = req.params;
  const { receipient, receipientContact, receipientSignatureUrl } = req.body;

  const mail = await MailRepository.findOne({
    where: { mailId },
    relations: {
      driver: true,
    },
  });
  if (!mail) {
    res.status(404).json({
      message: "No mail with id provided",
    });
    return;
  }

  mail.receipient = receipient;
  mail.receipientContact = receipientContact;
  mail.receipientSignatureUrl = receipientSignatureUrl;
  mail.status = "delivered";
  const savedMail = await MailRepository.save(mail);

  const mailLog = new MailLog();
  mailLog.mailLogId = uuidv4();
  mailLog.mailId = mailId;
  mailLog.status = "delivered";
  mailLog.updatedAt = new Date();
  const savedMailLog = await MailLogRepository.save(mailLog);

  res.status(200).json({
    message: "Mail received",
    mail: {
      ...savedMail,
      mailLog: savedMailLog,
    },
  });
}

async function getAllDrivers(req: Request, res: Response) {
  const { start = 1, limit = 10, search = "" } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);

  const [drivers, total] = await DriverRepository.findAndCount({
    where: [{ name: ILike(`%${search}%`) }, { contact: ILike(`%${search}%`) }],
    take: pageSize,
    skip: startNumber - 1,
  });

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "retrieved all drivers",
    drivers,
    meta: {
      start,
      end,
      total,
    },
  });
}

async function findDriverByName(req: Request, res: Response) {
  const { search } = req.body;

  const drivers = await DriverRepository.find({});

  const foundDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  res.status(200).json({
    message: "Returned search for driver",
    drivers: foundDrivers,
  });
}

async function addNewDriver(req: Request, res: Response) {
  const { name, contact } = req.body;

  const existingDriver = await DriverRepository.find({
    where: [{ name }, { contact }],
  });
  if (existingDriver.length > 0) {
    res.status(400).json({
      message: "Driver with name/contact already exists",
    });
    return;
  }

  const driver = new Driver();
  driver.driverId = uuidv4();
  driver.name = name;
  driver.contact = contact;
  const savedDriver = await DriverRepository.save(driver);

  res.status(200).json({
    message: "New driver added",
    driver: savedDriver,
  });
}

async function getDriverById(req: Request, res: Response) {
  const { id: driverId } = req.params;

  const driver = await DriverRepository.findOne({ where: { driverId } });
  if (!driver) {
    res.status(404).json({
      message: "Driver with id provided not found",
    });
    return;
  }

  res.status(200).json({
    message: "Driver found",
    driver,
  });
}

async function getAllMailsForDriver(req: Request, res: Response) {
  const { id: driverId } = req.params;
  const { start = 1, limit = 10, search = "", date } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(`${date}T23:59:59.999Z`);

  const driver = await DriverRepository.findOne({ where: { driverId } });
  if (!driver) {
    res.status(404).json({
      message: "Driver with id provided not found",
    });
    return;
  }

  const [deliveries, total] = await MailRepository.findAndCount({
    where: [
      {
        driverId,
        referenceNumber: ILike(`%${search}%`),
        date: Between(new Date(startDate), new Date(endDate)),
      },
      {
        driverId,
        addressee: ILike(`%${search}%`),
        date: Between(new Date(startDate), new Date(endDate)),
      },
    ],
    skip: startNumber - 1,
    take: pageSize,
  });

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "All mails for driver retrieved",
    deliveries,
    meta: {
      total,
      start,
      end,
    },
  });
}

export {
  addNewMail,
  getAllMails,
  getAllPendingMails,
  getAllTransitMails,
  getAllDeliveredMails,
  getMailById,
  dispatchMail,
  receiveMail,
  addNewDriver,
  getAllMailsForDriver,
  getAllDrivers,
  findDriverByName,
  getDriverById,
};
