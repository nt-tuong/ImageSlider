import { useEffect, useMemo, useState } from "react";
import MessageHelper from "../../components/common/MessageHelper";
import MessageIcon from "../../components/icons/MessageIcon";
import "./index.css";

const ROTATING_MESSAGES = [
  "i",
  "ああああああああああああああああああああ",
  "Chào bạn — đây là tin đầu tiên.",
  "Tin thứ hai xuất hiện sau vài giây.",
  "Sau tin cuối, khung gợi ý sẽ tự ẩn.",
];

type MessageLine = { id: string; value: string };

const newLineId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const MessageHelperPage = () => {
  const [rotateDemoKey, setRotateDemoKey] = useState(0);
  const [messageLines, setMessageLines] = useState<MessageLine[]>([
    { id: newLineId(), value: "" },
  ]);

  const customMessages = useMemo(
    () =>
      messageLines
        .map((l) => l.value.trim())
        .filter((s) => s.length > 0),
    [messageLines]
  );

  useEffect(() => {
    document.title = "Message Helper Sample";
  }, []);

  return (
    <div className="message-helper-page">
      <header className="message-helper-page__header">
        <h1>MessageHelper + MessageIcon</h1>
        <p>
          <code>MessageHelper</code> cần nằm trong wrapper{" "}
          <code>position: relative</code> ôm sát chiều cao icon — nếu để trong
          ô lớn (ví dụ <code>min-height</code> cao), <code>bottom: %</code> sẽ
          tính theo ô đó và bong bóng lệch khỏi icon.
        </p>
      </header>

      <section className="message-helper-demo">
        <h2>Một dòng gợi ý (luôn hiển thị)</h2>
        <p className="message-helper-demo__hint">
          Khi chỉ có một phần tử trong <code>messages</code>, gợi ý không tự
          tắt.
        </p>
        <div className="message-helper-demo__anchor">
          <div className="message-helper-demo__icon-wrap">
            <MessageHelper messages={["Nhấn biểu tượng để mở tin nhắn."]} />
            <MessageIcon size={44} color="#272937" aria-hidden />
          </div>
        </div>
      </section>

      <section className="message-helper-demo">
        <h2>Icon có thể nhấn</h2>
        <div className="message-helper-demo__anchor">
          <div className="message-helper-demo__icon-wrap">
            <MessageHelper
              messages={["i"]}
              // messages={["Bạn có thông báo mới trong hộp thư."]}
              intervalMs={5000}
            />
            <MessageIcon
              size={44}
              color="#3b4a8c"
              onClick={() => {
                window.alert("Ví dụ: mở panel tin nhắn.");
              }}
              aria-label="Mở tin nhắn (demo)"
            />
          </div>
        </div>
      </section>

      <section className="message-helper-demo">
        <h2>Nhiều tin luân phiên</h2>
        <p className="message-helper-demo__hint">
          Sau khi hiện hết danh sách, component ẩn. Dùng nút bên dưới để chạy
          lại demo.
        </p>
        <div className="message-helper-demo__anchor">
          <div className="message-helper-demo__icon-wrap">
            <MessageHelper
              key={rotateDemoKey}
              messages={ROTATING_MESSAGES}
              intervalMs={2800}
            />
            <MessageIcon size={44} color="#272937" aria-hidden />
          </div>
        </div>
        <button
          type="button"
          className="message-helper-demo__reset"
          onClick={() => setRotateDemoKey((k) => k + 1)}
        >
          Chạy lại chuỗi tin
        </button>
      </section>

      <section className="message-helper-demo message-helper-dynamic">
        <h2>Tự nhập danh sách tin</h2>
        <p className="message-helper-demo__hint">
          Nhập nội dung từng dòng; nhấn <strong>Add</strong> để thêm ô nhập.
          Các dòng không trống (sau trim) được đưa vào{" "}
          <code>messages</code> của <code>MessageHelper</code>.
        </p>

        <div className="message-helper-dynamic__fields">
          {messageLines.map((line, index) => (
            <label
              key={line.id}
              className="message-helper-dynamic__row"
              htmlFor={`message-line-${line.id}`}
            >
              <span className="message-helper-dynamic__label">
                Tin {index + 1}
              </span>
              <input
                id={`message-line-${line.id}`}
                className="message-helper-dynamic__input"
                type="text"
                value={line.value}
                placeholder="Nhập nội dung gợi ý…"
                onChange={(e) => {
                  const v = e.target.value;
                  setMessageLines((prev) =>
                    prev.map((l) => (l.id === line.id ? { ...l, value: v } : l))
                  );
                }}
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          className="message-helper-demo__reset message-helper-dynamic__add"
          onClick={() =>
            setMessageLines((prev) => [...prev, { id: newLineId(), value: "" }])
          }
        >
          Add
        </button>

        <div className="message-helper-demo__anchor message-helper-dynamic__anchor">
          {customMessages.length === 0 ? (
            <p className="message-helper-dynamic__empty">
              Nhập ít nhất một dòng có chữ để thấy gợi ý phía trên icon.
            </p>
          ) : null}
          <div className="message-helper-demo__icon-wrap">
            {customMessages.length > 0 ? (
              <MessageHelper messages={customMessages} intervalMs={3200} />
            ) : null}
            <MessageIcon size={44} color="#272937" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MessageHelperPage;
