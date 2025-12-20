"use client";

import {
    Card,
    CardBody,
    Avatar
} from "@heroui/react";

export default function TabPins({ targetUser }) {
    return (
        <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow hover:border-slate-600 mt-4">
            <CardBody className="p-6">
                <div className="text-center text-gray-400 py-8">
                    <div className="flex gap-4 items-center mt-4 justify-center">
                        <Avatar className="w-20 h-20" isBordered color="default" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Gaia_mission_insignia.png/250px-Gaia_mission_insignia.png" />
                        <Avatar className="w-20 h-20" isBordered color="success" src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2016/12/jwst_mission_logo/16561412-4-eng-GB/JWST_mission_logo_pillars.png" />
                        <Avatar className="w-20 h-20" isBordered color="primary" src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2024/03/proba-3_mission_patch/26000821-1-eng-GB/Proba-3_mission_patch_article.png" />
                        <Avatar className="w-20 h-20" isBordered color="secondary" src="https://platomission.com/wp-content/uploads/2020/01/plato_logo_320x320.png" />
                        <Avatar className="w-20 h-20" isBordered color="warning" src="https://pbs.twimg.com/profile_images/1336242180483112960/NEch5hh-_400x400.jpg" />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
